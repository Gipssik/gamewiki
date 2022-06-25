from typing import Optional

from backend.web.api.game.schema import GameInDB
from backend.web.api.platform.schema import PlatformInDB
from backend.web.api.sale.schema import SaleInDB
from backend.web.api.user.schema import UserInDB


class Sale(SaleInDB):
    game: GameInDB
    platform: PlatformInDB
    created_by_user: Optional[UserInDB] = None
