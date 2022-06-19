from datetime import date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class GameBase(BaseModel):
    title: Optional[str] = None
    released_at: Optional[date] = None
    platforms: Optional[set[UUID]] = None
    genres: Optional[set[UUID]] = None
