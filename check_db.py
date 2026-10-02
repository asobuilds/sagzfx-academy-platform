"""
SAGZFX ACADEMY — Database connectivity check.
Connects to Neon, lists all tables in the public schema,
and confirms the connection is healthy.
"""
import asyncio
import os
from pathlib import Path

import asyncpg
from dotenv import load_dotenv

# Load .env from this directory
load_dotenv(Path(__file__).parent / ".env")


async def main() -> None:
    url = os.getenv("DATABASE_URL")
    if not url:
        print("❌ DATABASE_URL is not set in .env")
        return

    # asyncpg wants postgresql:// but rejects some SQLAlchemy-style params
    # Strip the ones that aren't valid for raw asyncpg.
    for bad in ("&channel_binding=require", "?channel_binding=require"):
        url = url.replace(bad, "")

    # Safe display
    safe = url.split("@")[-1] if "@" in url else url
    print(f"→ Connecting to host: {safe}")
    print()

    try:
        conn = await asyncpg.connect(url)
    except Exception as e:
        print(f"❌ Could NOT connect: {type(e).__name__}: {e}")
        return

    try:
        version = await conn.fetchval("SELECT version();")
        print("✅ Connection OK")
        print(f"   Server: {version.split(',')[0]}")
        print()

        tables = await conn.fetch(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
            """
        )

        if not tables:
            print("⚠️  No tables found in the public schema.")
            print("   → Your schema.sql has NOT been loaded yet.")
            print("   → We will load it in the next sub-step.")
        else:
            print(f"✅ Found {len(tables)} table(s) in the database:")
            for row in tables:
                print(f"   • {row['table_name']}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
