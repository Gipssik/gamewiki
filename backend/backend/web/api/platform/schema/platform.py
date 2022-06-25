from typing import Optional

from pydantic import validator

from backend.web.api.game.schema import GameInDB
from backend.web.api.platform.schema import PlatformInDB
from backend.web.api.sale.schema.sale import Sale
from backend.web.api.user.schema import UserInDB


class Platform(PlatformInDB):
    created_by_user: Optional[UserInDB] = None
    games: list[GameInDB] = []
    sales: list[Sale] = []

    @validator("games", "sales", pre=True)
    def convert_to_list(cls, v) -> list:
        return list(v)
