import asyncio

import typer
import uvicorn

from backend.cli import create_primary_user
from backend.settings import settings

app = typer.Typer()


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
