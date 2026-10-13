"""
SAGZFX ACADEMY - Migration applier.

Reads and applies migrations/006_lesson_content.sql and
migrations/007_masterclass_expansion.sql in order.

Safety:
  - Each file is read in full before any execution.
  - Each file is applied in its own transaction.
  - If a file fails, the transaction rolls back and the script stops.
  - Verification queries run after each application.

Does NOT create new migrations. Does NOT touch app/ or frontend/.
"""
import asyncio
import os
from pathlib import Path

import asyncpg
from dotenv import load_dotenv

ROOT = Path(__file__).parent
MIGRATIONS = ROOT / "migrations"
APPLY = [
    "006_lesson_content.sql",
    "007_masterclass_expansion.sql",
]

load_dotenv(ROOT / ".env")


def clean_url(url: str) -> str:
    for bad in ("&channel_binding=require", "?channel_binding=require"):
        url = url.replace(bad, "")
    return url


async def apply_one(conn, filename: str) -> None:
    path = MIGRATIONS / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing migration: {path}")

    sql = path.read_text(encoding="utf-8")
    line_count = sql.count("\n") + 1
    print(f"\n── Applying {filename} ({line_count} lines) ──")

    async with conn.transaction():
        await conn.execute(sql)

    print(f"✅ {filename} applied")


async def verify(conn) -> None:
    print("\n── Verification ──")

    # New columns on course_modules
    cols = await conn.fetch(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'course_modules'
        ORDER BY ordinal_position;
        """
    )
    col_names = [r["column_name"] for r in cols]
    print(f"course_modules columns ({len(col_names)}):")
    for c in col_names:
        print(f"   • {c}")

    # Masterclass row count
    masterclass = await conn.fetchval(
        "SELECT COUNT(*) FROM course_modules WHERE tier_level = 'Masterclass';"
    )
    print(f"\nMasterclass rows: {masterclass} (expect 11)")

    # Masterclass titles
    rows = await conn.fetch(
        """
        SELECT module_id, title
        FROM course_modules
        WHERE tier_level = 'Masterclass'
        ORDER BY sort_order;
        """
    )
    print("\nMasterclass modules:")
    for r in rows:
        print(f"   • {r['module_id']}: {r['title']}")

    # L3-MOD14 retitle
    retitle = await conn.fetchrow(
        "SELECT title FROM course_modules WHERE module_id = 'L3-MOD14';"
    )
    print(f"\nL3-MOD14 title: {retitle['title']}")

    # Total row count
    total = await conn.fetchval("SELECT COUNT(*) FROM course_modules;")
    print(f"\nTotal course_modules rows: {total} (expect 57)")


async def main() -> None:
    url = os.getenv("DATABASE_URL")
    if not url:
        print("❌ DATABASE_URL missing from .env")
        return

    print("→ Connecting to Neon...")
    conn = await asyncpg.connect(clean_url(url))

    try:
        for filename in APPLY:
            await apply_one(conn, filename)
        await verify(conn)
        print("\n✅ All migrations applied successfully.")
    except Exception as e:
        print(f"\n❌ FAILED: {type(e).__name__}: {e}")
        print("   Transaction was rolled back for the failing file.")
        print("   Earlier files that completed remain applied.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
