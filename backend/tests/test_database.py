import os
import aiosqlite

from database import init_db


async def test_init_db_creates_users_table(monkeypatch, tmp_path):
    db_file = str(tmp_path / "test.db")
    monkeypatch.setattr("database.DATABASE_PATH", db_file)

    await init_db()

    async with aiosqlite.connect(db_file) as db:
        async with db.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
        ) as cursor:
            row = await cursor.fetchone()
    assert row is not None, "users table should be created"


async def test_init_db_is_idempotent(monkeypatch, tmp_path):
    db_file = str(tmp_path / "test_idempotent.db")
    monkeypatch.setattr("database.DATABASE_PATH", db_file)

    await init_db()
    await init_db()

    async with aiosqlite.connect(db_file) as db:
        async with db.execute("SELECT COUNT(*) FROM users") as cursor:
            row = await cursor.fetchone()
    assert row[0] == 0
