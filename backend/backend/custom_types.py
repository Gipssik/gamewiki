from enum import Enum
from typing import Optional

from fastapi import Query
from pydantic import BaseModel


class Order(str, Enum):
    ASC = "asc"
    DESC = "desc"


class OrderColumn(BaseModel):
    column: Enum  # Enum with possible names of columns to order by
    order: Order


class UserOrderColumns(str, Enum):
    USERNAME = "username"
    EMAIL = "email"
    IS_SUPERUSER = "is_superuser"
    CREATED_AT = "created_at"
    CREATED_COMPANIES = "created_companies"
    CREATED_PLATFORMS = "created_platforms"
    CREATED_GAMES = "created_games"
    CREATED_GENRES = "created_genres"
    CREATED_SALES = "created_sales"


class CompanyOrderColumns(str, Enum):
    TITLE = "title"
    FOUNDED_AT = "founded_at"
    CREATED_AT = "created_at"
    GAMES = "games"
    CREATED_BY_USER = "created_by_user"


class PlatformOrderColumns(str, Enum):
    TITLE = "title"
    GAMES = "games"
    SALES = "sales"
    CREATED_BY_USER = "created_by_user"


class GameOrderColumns(str, Enum):
    RELEASED_AT = "released_at"
    CREATED_AT = "created_at"
    SALES = "sales"
    PLATFORMS = "platforms"
    GENRES = "genres"


class CommonQueries(BaseModel):
    skip: Optional[int] = Query(0, ge=0)
    limit: Optional[int] = Query(100, ge=1)
