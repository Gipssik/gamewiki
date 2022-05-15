from datetime import datetime
from uuid import UUID

from .game_base import GameBase


class GameCreate(GameBase):
    title: str
    released_at: datetime
    created_by_company_id: UUID
