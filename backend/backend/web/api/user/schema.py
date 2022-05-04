from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from backend.web.api.company import schema as company_schema
from backend.web.api.game import schema as game_schema
from backend.web.api.genre import schema as genre_schema
from backend.web.api.platform import schema as platform_schema
from backend.web.api.sale import schema as sale_schema


class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

    class Config:
        allow_population_by_field_name = True


class UserCreate(UserBase):
    username: str
    email: EmailStr
    hashed_password: str = Field(alias="password")


class UserUpdate(UserBase):
    hashed_password: str = Field(alias="password")


class User(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime
    created_companies: list[company_schema.Company] = []
    created_platforms: list[platform_schema.Platform] = []
    created_games: list[game_schema.Game] = []
    created_genres: list[genre_schema.Genre] = []
    created_sales: list[sale_schema.Sale] = []

    class Config:
        orm_mode = True
