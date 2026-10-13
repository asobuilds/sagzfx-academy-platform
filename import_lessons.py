"""
SAGZFX ACADEMY - Lesson content importer.

Reads Markdown files from frontend/content/lessons/<Tier>/*.md and upserts
the parsed content into course_modules.

Idempotent: re-running is safe. Existing lessons are updated.

Robust against YAML variants:
  - learning_outcomes as list[str]
  - learning_outcomes as list[dict] with any key names
  - learning_outcomes as single string
  - checkpoint_questions with A/B/C/D or 1/2/3/4 or bare-option shapes
  - missing sections (gracefully skipped)

Does NOT touch schema. Does NOT create new files. Does NOT touch app/.
"""
import asyncio
import json
import os
import re
from pathlib import Path

import asyncpg
import yaml
from dotenv import load_dotenv

ROOT = Path(__file__).parent
LESSONS_DIR = ROOT / "frontend" / "content" / "lessons"
TIER_FOLDERS = {
    "Beginner": "Beginner",
    "Market-Structure": "Market Structure",
    "Advanced": "Advanced",
    "Masterclass": "Masterclass",
}

load_dotenv(ROOT / ".env")


# ─── Utilities ────────────────────────────────────────────────

def clean_url(url: str) -> str:
    for bad in ("&channel_binding=require", "?channel_binding=require"):
        url = url.replace(bad, "")
    return url


def flatten_to_strings(raw) -> list[str]:
    """
    Normalize any YAML value into a list of plain strings.

    Handles:
      - None                     -> []
      - "single string"          -> ["single string"]
      - ["str1", "str2"]         -> ["str1", "str2"]
      - [{"text": "..."}]        -> ["..."]
      - [{"a": "...", "b": "..."}] -> ["... — ..."]
      - [123, 456]               -> ["123", "456"]
      - nested lists/dicts       -> flattened via stringification
    """
    if raw is None:
        return []

    if isinstance(raw, str):
        return [raw] if raw.strip() else []

    if isinstance(raw, (int, float, bool)):
        return [str(raw)]

    if isinstance(raw, dict):
        values: list[str] = []
        for v in raw.values():
            values.extend(flatten_to_strings(v))
        return values

    if isinstance(raw, (list, tuple)):
        out: list[str] = []
        for item in raw:
            out.extend(flatten_to_strings(item))
        return out

    return [str(raw)]


def join_outcome_parts(parts: list[str]) -> str:
    """Join multi-value outcomes into a single displayable string."""
    cleaned = [p.strip() for p in parts if p and p.strip()]
    if not cleaned:
        return ""
    if len(cleaned) == 1:
        return cleaned[0]
    return " — ".join(cleaned)


def normalize_outcomes(raw) -> list[str]:
    """
    Convert learning_outcomes to a clean list[str] for a Postgres TEXT[].

    Each entry in the source list may itself be a string or a dict.
    Multi-value dicts get joined into a single string.
    """
    if raw is None:
        return []

    # Single dict at top level
    if isinstance(raw, dict):
        joined = join_outcome_parts(flatten_to_strings(raw))
        return [joined] if joined else []

    # Single string
    if isinstance(raw, str):
        return [raw] if raw.strip() else []

    # List
    if isinstance(raw, (list, tuple)):
        result: list[str] = []
        for item in raw:
            if isinstance(item, str):
                if item.strip():
                    result.append(item.strip())
            elif isinstance(item, dict):
                joined = join_outcome_parts(flatten_to_strings(item))
                if joined:
                    result.append(joined)
            else:
                s = str(item).strip()
                if s:
                    result.append(s)
        return result

    return []


# ─── Section extraction ──────────────────────────────────────

def extract_section(body: str, section_number: int) -> str:
    """
    Extract the body of '## N. Title' up to the next '## M.' heading.
    Returns empty string if not found.
    """
    pattern = rf"^##\s*{section_number}\.\s*[^\n]*\n(.*?)(?=^##\s*\d+\.|\Z)"
    m = re.search(pattern, body, re.DOTALL | re.MULTILINE)
    return m.group(1).strip() if m else ""


# ─── Checkpoint parsing ──────────────────────────────────────

def parse_checkpoint(raw: str) -> dict | None:
    """
    Extract a checkpoint question from the §7 body.

    Accepts multiple shapes:
      - **Question:** ...  /  - A. ...  /  **Correct answer:** B  /  **Why:** ...
      - Question: ...      /  A) ...    /  Answer: B
      - Numbered options (1./2./3./4.) and lowercase letters (a/b/c/d)
    """
    if not raw.strip():
        return None

    # Question
    q_match = re.search(r"\*\*Question:?\*\*:?\s*(.+)", raw, re.IGNORECASE)
    if not q_match:
        q_match = re.search(r"^Question:?\s*(.+)", raw, re.MULTILINE | re.IGNORECASE)
    if not q_match:
        return None
    question = q_match.group(1).strip()

    # Options — support "A.", "A)", "a.", "1.", "1)" with or without bold
    option_pattern = re.compile(
        r"^\s*[-*]?\s*\*{0,2}(?:([A-Da-d])|([1-4]))[.)]\*{0,2}\s+(.+)$",
        re.MULTILINE,
    )
    matches = option_pattern.findall(raw)

    options: list[str] = []
    letters: list[str] = []
    for letter, number, text in matches:
        if letter:
            letters.append(letter.upper())
        elif number:
            letters.append(chr(ord("A") + int(number) - 1))
        options.append(text.strip())

    if len(options) != 4:
        return None

    # Correct answer
    ans_match = re.search(
        r"\*\*Correct answer:?\*\*:?\s*\*{0,2}([A-Da-d]|[1-4])\*{0,2}",
        raw,
        re.IGNORECASE,
    )
    if not ans_match:
        ans_match = re.search(
            r"(?:Answer|Correct):?\s*\*{0,2}([A-Da-d]|[1-4])\*{0,2}",
            raw,
            re.IGNORECASE,
        )
    if not ans_match:
        return None

    ans_token = ans_match.group(1).upper()
    if ans_token.isdigit():
        correct_index = int(ans_token) - 1
    else:
        correct_index = ord(ans_token) - ord("A")

    if correct_index < 0 or correct_index > 3:
        return None

    # Why
    why_match = re.search(r"\*\*Why:?\*\*:?\s*(.+)", raw, re.IGNORECASE)
    if not why_match:
        why_match = re.search(r"^Why:?\s*(.+)", raw, re.MULTILINE | re.IGNORECASE)
    explanation = why_match.group(1).strip() if why_match else ""

    return {
        "prompt": question,
        "options": options,
        "correct_index": correct_index,
        "explanation": explanation,
    }


# ─── Lesson parsing ──────────────────────────────────────────

def parse_lesson(path: Path) -> dict:
    """Parse front-matter and body from a lesson Markdown file."""
    text = path.read_text(encoding="utf-8")

    if not text.lstrip().startswith("---"):
        raise ValueError(f"{path.name}: missing front-matter")

    stripped = text.lstrip()
    parts = stripped.split("---", 2)
    if len(parts) < 3:
        raise ValueError(f"{path.name}: malformed front-matter")

    fm_raw = parts[1]
    body = parts[2].strip()

    try:
        fm = yaml.safe_load(fm_raw)
    except yaml.YAMLError as e:
        raise ValueError(f"{path.name}: YAML error: {e}")

    if not isinstance(fm, dict):
        raise ValueError(f"{path.name}: front-matter is not a dict")

    module_id = fm.get("module_id")
    if not module_id:
        raise ValueError(f"{path.name}: no module_id in front-matter")

    # Outcomes — accept any YAML shape
    outcomes = normalize_outcomes(fm.get("learning_outcomes"))

    # §6 assignment
    assignment = extract_section(body, 6)

    # §7 checkpoint
    checkpoint_raw = extract_section(body, 7)
    checkpoint = parse_checkpoint(checkpoint_raw) if checkpoint_raw else None

    return {
        "module_id": str(module_id).strip(),
        "lesson_body": body,
        "learning_outcomes": outcomes,
        "assignment": assignment,
        "checkpoint_questions": checkpoint,
    }


# ─── Main ────────────────────────────────────────────────────

async def main() -> None:
    url = os.getenv("DATABASE_URL")
    if not url:
        print("❌ DATABASE_URL missing from .env")
        return

    print("→ Connecting to Neon...")
    conn = await asyncpg.connect(clean_url(url))

    try:
        total_imported = 0
        total_failed = 0
        failures: list[str] = []

        for folder, tier in TIER_FOLDERS.items():
            folder_path = LESSONS_DIR / folder
            if not folder_path.exists():
                print(f"⚠️  Missing folder: {folder_path}")
                continue

            files = sorted(folder_path.glob("*.md"))
            print(f"\n── {tier} ({len(files)} files) ──")

            for f in files:
                try:
                    parsed = parse_lesson(f)
                except Exception as e:
                    print(f"   ❌ {f.name}: {e}")
                    failures.append(f"{tier}/{f.name}: {e}")
                    total_failed += 1
                    continue

                checkpoint_json = (
                    json.dumps(parsed["checkpoint_questions"])
                    if parsed["checkpoint_questions"]
                    else None
                )

                try:
                    await conn.execute(
                        """
                        UPDATE course_modules
                           SET lesson_body           = $1,
                               learning_outcomes     = $2,
                               assignment            = $3,
                               checkpoint_questions  = $4::jsonb,
                               lesson_status         = 'in_review',
                               lesson_updated_at     = now(),
                               updated_at            = now()
                         WHERE module_id = $5
                        """,
                        parsed["lesson_body"],
                        parsed["learning_outcomes"],
                        parsed["assignment"],
                        checkpoint_json,
                        parsed["module_id"],
                    )
                    total_imported += 1
                except Exception as e:
                    print(f"   ❌ DB error on {f.name}: {e}")
                    failures.append(f"{tier}/{f.name}: DB {type(e).__name__}")
                    total_failed += 1

            print(f"   ✅ {len(files)} processed")

        print(f"\n══════ Import summary ══════")
        print(f"  Imported:  {total_imported}")
        print(f"  Failed:    {total_failed}")
        if failures:
            print("\n  Failures:")
            for fail in failures:
                print(f"    - {fail}")

        # Verification
        counts = await conn.fetch(
            """
            SELECT lesson_status, COUNT(*)
              FROM course_modules
             WHERE lesson_body IS NOT NULL
             GROUP BY lesson_status
            """
        )
        print("\n── Verification ──")
        for row in counts:
            print(f"   status={row['lesson_status']}: {row['count']} rows")

        sample = await conn.fetchrow(
            """
            SELECT module_id, LENGTH(lesson_body) AS len, learning_outcomes
              FROM course_modules
             WHERE lesson_body IS NOT NULL
             ORDER BY module_id
             LIMIT 1
            """
        )
        if sample:
            print(f"\n   Sample: {sample['module_id']}")
            print(f"           body length: {sample['len']} chars")
            print(f"           outcomes:    {sample['learning_outcomes']}")

        checkpoints = await conn.fetchval(
            "SELECT COUNT(*) FROM course_modules WHERE checkpoint_questions IS NOT NULL;"
        )
        print(f"\n   Lessons with checkpoints: {checkpoints}")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
