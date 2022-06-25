import typer
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from backend.cli.db import create_user, get_user_dao, primary_user_exists
from backend.web.api.user.schema.user_create import UserCreate


def get_credentials() -> UserCreate:
    while True:
        data = {
            "username": input("Username: "),
            "email": input("Email: "),
            "password": input("Password: "),
        }
        try:
            if data["username"] and data["email"] and data["password"]:
                return UserCreate(**data)
        except ValidationError as error:
            print(f"Invalid credentials: {error.json()}")
            continue
        print("Please provide all credentials.")


async def create_primary_user() -> None:
    user_dao = await get_user_dao()
    primary_exists = await primary_user_exists(user_dao)
    if primary_exists:
        typer.echo("Primary user already exists.")
        return

    try:
        credentials = get_credentials()
        await create_user(user_dao, credentials)
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            typer.echo("User with these credentials already exists.")
            return
        raise error
    typer.echo("Primary user created successfully.")
