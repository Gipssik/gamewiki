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


@app.command()
def createprimaryuser():
    """Creates a primary user."""
    asyncio.run(create_primary_user())


if __name__ == "__main__":
    app()
