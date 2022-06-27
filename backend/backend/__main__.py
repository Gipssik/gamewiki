import asyncio
import datetime
import subprocess

import typer
import uvicorn

from backend.cli import create_primary_user
from backend.settings import settings

app = typer.Typer()


@app.command()
def backup() -> None:
    """Backups a database"""
    filename = f"backup-{datetime.datetime.utcnow()}.sql".replace(" ", "T")
    cmd = (
        f"pg_dump -f {filename} -F p -h {settings.db_host}"
        f" -U {settings.db_user} {settings.db_base}".split()
    )
    popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)

    popen.stdout.close()
    popen.wait()


@app.command()
def runserver() -> None:
    """Starts the application using settings from 'backend.settings'."""
    uvicorn.run(
        "backend.web.application:app",
        workers=settings.workers_count,
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
    )


@app.command(name="createprimaryuser")
def create_primary_user_command(username: str, password: str, email: str):
    """Creates a primary user."""
    asyncio.run(create_primary_user(username, password, email))


if __name__ == "__main__":
    app()
