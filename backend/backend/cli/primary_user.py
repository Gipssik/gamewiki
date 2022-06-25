import typer
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from backend.cli.db import create_user, get_user_dao, primary_user_exists
from backend.web.api.user.schema.user_create import UserCreate


def get_credentials_model(username: str, password: str, email: str) -> UserCreate:
    data = {
        "username": username,
        "email": email,
        "password": password,
    }
    return UserCreate(**data)


async def create_primary_user(username: str, password: str, email: str) -> None:
    user_dao = await get_user_dao()
    primary_exists = await primary_user_exists(user_dao)
    if primary_exists:
        typer.echo("Primary user already exists.")
        return

    try:
        credentials = get_credentials_model(username, password, email)
        await create_user(user_dao, credentials)
    except ValidationError as error:
        typer.echo(str(error))
        return
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            typer.echo("User with these credentials already exists.")
            return
        raise error
    typer.echo("Primary user created successfully.")
