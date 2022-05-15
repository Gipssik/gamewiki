from backend.web.api.game.schema.game import Game
from backend.web.api.genre.schema import GenreInDB
from backend.web.api.user.schema import UserInDB


class Genre(GenreInDB):
    created_by_user: UserInDB
    games: list[Game] = []
