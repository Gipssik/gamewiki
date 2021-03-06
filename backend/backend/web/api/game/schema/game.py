from typing import Optional

from pydantic import validator

from backend.web.api.company.schema import CompanyInDB
from backend.web.api.game.schema import GameInDB
from backend.web.api.genre.schema import GenreInDB
from backend.web.api.platform.schema import PlatformInDB
from backend.web.api.sale.schema.sale import Sale
from backend.web.api.user.schema import UserInDB


class Game(GameInDB):
    created_by_company: CompanyInDB
    created_by_user: Optional[UserInDB] = None
    genres: list[GenreInDB] = []
    platforms: list[PlatformInDB] = []
    sales: list[Sale] = []

    @validator("genres", "platforms", "sales", pre=True)
    def convert_to_list(cls, v) -> list:
        return list(v)
