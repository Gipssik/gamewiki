from pydantic import validator

from backend.web.api.company.schema import CompanyInDB
from backend.web.api.game.schema import GameInDB
from backend.web.api.genre.schema import GenreInDB
from backend.web.api.platform.schema import PlatformInDB
from backend.web.api.sale.schema.sale import Sale
from backend.web.api.user.schema import UserInDB


class User(UserInDB):
    created_companies: list[CompanyInDB] = []
    created_platforms: list[PlatformInDB] = []
    created_games: list[GameInDB] = []
    created_genres: list[GenreInDB] = []
    created_sales: list[Sale] = []

    @validator(
        "created_companies",
        "created_platforms",
        "created_games",
        "created_genres",
        "created_sales",
        pre=True,
    )
    def convert_to_list(cls, v) -> list:
        return list(v)
