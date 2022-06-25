from pydantic import validator

from backend.web.api.company.schema import CompanyInDB
from backend.web.api.game.schema.game import Game
from backend.web.api.user.schema import UserInDB


class Company(CompanyInDB):
    created_by_user: UserInDB
    games: list[Game] = []

    @validator("games", pre=True)
    def convert_to_list(cls, v) -> list:
        return list(v)
