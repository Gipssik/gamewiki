from datetime import date
from uuid import UUID

from .game_base import GameBase


class GameCreate(GameBase):
    title: str
    released_at: date
    created_by_company_id: UUID
