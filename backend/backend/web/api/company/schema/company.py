from typing import Optional

from pydantic import validator

from backend.web.api.company.schema import CompanyInDB
from backend.web.api.game.schema import GameInDB
from backend.web.api.user.schema import UserInDB


class Company(CompanyInDB):
    created_by_user: Optional[UserInDB] = None
    games: list[GameInDB] = []

    @validator("games", pre=True)
    def convert_to_list(cls, v) -> list:
        return list(v)
