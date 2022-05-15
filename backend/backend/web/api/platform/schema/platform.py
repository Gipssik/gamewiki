from backend.web.api.game.schema.game import Game
from backend.web.api.platform.schema import PlatformInDB
from backend.web.api.sale.schema.sale import Sale
from backend.web.api.user.schema import UserInDB


class Platform(PlatformInDB):
    created_by_user: UserInDB
    games: list[Game] = []
    sales: list[Sale] = []
