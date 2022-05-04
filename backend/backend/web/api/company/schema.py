from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from backend.web.api.game import schema as game_schema
from backend.web.api.user import schema as user_schema


class CompanyBase(BaseModel):
    title: Optional[str]
    founded_at: Optional[datetime]


class CompanyCreate(CompanyBase):
    title: str
    founded_at: datetime


class CompanyUpdate(CompanyBase):
    ...


class Company(BaseModel):
    id: UUID
    title: str
    founded_at: datetime
    created_at: datetime
    created_by_user: user_schema.User
    games: list[game_schema.Game] = []

    class Config:
        orm_mode = True
