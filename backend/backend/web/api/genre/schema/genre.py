from typing import Optional

from pydantic import validator

from backend.web.api.game.schema import GameInDB
from backend.web.api.genre.schema import GenreInDB
from backend.web.api.user.schema import UserInDB


class Genre(GenreInDB):
    created_by_user: Optional[UserInDB] = None
    games: list[GameInDB] = []

    @validator("games", pre=True)
    def convert_to_list(cls, v) -> list:
        return list(v)
