from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class GameBase(BaseModel):
    title: Optional[str] = None
    released_at: Optional[date] = None
    platforms: Optional[list[UUID]] = None
    genres: Optional[list[UUID]] = None
