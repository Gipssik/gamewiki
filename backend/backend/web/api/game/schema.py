from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from backend.web.api.company import schema as company_schema
from backend.web.api.genre import schema as genre_schema
from backend.web.api.platform import schema as platform_schema
from backend.web.api.sale.schema import Sale
from backend.web.api.user import schema as user_schema


class GameBase(BaseModel):
    title: Optional[str] = None
    released_at: Optional[datetime] = None


class GameCreate(GameBase):
    title: str
    released_at: datetime
    created_by_company_id: UUID


class GameUpdate(GameBase):
    ...


class Game(BaseModel):
    id: UUID
    title: str
    released_at: datetime
    created_at: datetime
    created_by_company: company_schema.Company
    created_by_user: user_schema.User
    genres: list[genre_schema.Genre] = []
    platforms: list[platform_schema.Platform] = []
    sales: list[Sale] = []

    class Config:
        orm_mode = True
