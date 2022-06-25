from pydantic import validator

from backend.web.api.company.schema.company import Company
from backend.web.api.game.schema.game import Game
from backend.web.api.genre.schema.genre import Genre
from backend.web.api.platform.schema.platform import Platform
from backend.web.api.sale.schema.sale import Sale
from backend.web.api.user.schema import UserInDB


class User(UserInDB):
    created_companies: list[Company] = []
    created_platforms: list[Platform] = []
    created_games: list[Game] = []
    created_genres: list[Genre] = []
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
