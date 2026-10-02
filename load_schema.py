"""
SAGZFX ACADEMY — Load schema.sql into Neon.

Strategy:
  - Read schema.sql from disk.
  - Connect to Neon via asyncpg.
  - Execute the ENTIRE file inside one transaction.
  - If anything fails, roll back — so we never end up half-loaded.
  - Handle the known Postgres quirk where CREATE EXTENSION can fail
    silently on managed platforms; we check for uuid_generate_v4()
    availability and fall back to gen_random_uuid() if needed.
"""
import asyncio
import os
import re
from pathlib import Path

import asyncpg
from dotenv import load_dotenv

ROOT = Path(__file__).parent
SCHEMA_FILE = ROOT / "schema.sql"

load_dotenv(ROOT / ".env")


def clean_url(url: str) -> str:
    for bad in ("&channel_binding=require", "?channel_binding=require"):
        url = url.replace(bad, "")
    return url


async def main() -> None:
    url = os.getenv("DATABASE_URL")
    if not url:
        print("❌ DATABASE_URL missing from .env")
        return

    if not SCHEMA_FILE.exists():
        print(f"❌ {SCHEMA_FILE} not found")
        return

    sql = SCHEMA_FILE.read_text(encoding="utf-8")
    print(f"→ Loaded {SCHEMA_FILE.name} ({len(sql)} chars)")
    print(f"→ Connecting to Neon...")

    conn = await asyncpg.connect(clean_url(url))

    try:
        # ── Handle uuid-ossp vs pgcrypto gracefully ──────────
        # Try enabling uuid-ossp; if it fails, we substitute calls in the SQL.
        extension_ok = True
        try:
            await conn.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
            print("✅ uuid-ossp extension enabled")
        except Exception as e:
            print(f"⚠️  uuid-ossp not available ({type(e).__name__}). Will use pgcrypto.")
            extension_ok = False
            try:
                await conn.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')
                print("✅ pgcrypto extension enabled")
            except Exception as e2:
                print(f"❌ pgcrypto also failed: {e2}")
                raise

        # If uuid-ossp isn't available, rewrite uuid_generate_v4() → gen_random_uuid()
        if not extension_ok:
            sql = sql.replace("uuid_generate_v4()", "gen_random_uuid()")
            print("→ Rewrote uuid_generate_v4() → gen_random_uuid()")
            # Also remove the "CREATE EXTENSION uuid-ossp" line so it doesn't error again
            sql = re.sub(r'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";', "", sql)

        # Strip the CREATE TYPE user_role if it already exists (idempotency)
        # We'll let the transaction handle the duplicate error instead.

        print("→ Executing schema inside a single transaction...")
        async with conn.transaction():
            await conn.execute(sql)

        print("✅ Schema loaded successfully.")

        # ── Report tables ────────────────────────────────────
        tables = await conn.fetch(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
            """
        )
        print(f"\n✅ Tables now in database ({len(tables)}):")
        for row in tables:
            print(f"   • {row['table_name']}")

        # ── Report module count ──────────────────────────────
        try:
            count = await conn.fetchval("SELECT COUNT(*) FROM course_modules;")
            print(f"\n✅ course_modules rows: {count}")
        except Exception:
            pass

    except Exception as e:
        print(f"\n❌ FAILED: {type(e).__name__}")
        print(f"   {e}")
        print("\n   → Transaction rolled back. Database is unchanged.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
