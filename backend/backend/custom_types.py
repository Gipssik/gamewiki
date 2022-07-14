from enum import Enum
from typing import Optional

from fastapi import Query
from pydantic import AnyHttpUrl, BaseModel


class UserOrderColumns(str, Enum):
    USERNAME = "username"
    EMAIL = "email"
    IS_SUPERUSER = "is_superuser"
    IS_PRIMARY = "is_primary"
    CREATED_AT = "created_at"
    CREATED_COMPANIES = "created_companies"
    CREATED_PLATFORMS = "created_platforms"
    CREATED_GAMES = "created_games"
    CREATED_GENRES = "created_genres"
    CREATED_SALES = "created_sales"
    CREATED_BACKUPS = "created_backups"


class CompanyOrderColumns(str, Enum):
    TITLE = "title"
    FOUNDED_AT = "founded_at"
    CREATED_AT = "created_at"
    GAMES = "games"
    CREATED_BY_USER__USERNAME = "created_by_user"


class PlatformOrderColumns(str, Enum):
    TITLE = "title"
    GAMES = "games"
    SALES = "sales"
    CREATED_BY_USER__USERNAME = "created_by_user"


class GenreOrderColumns(str, Enum):
    TITLE = "title"
    GAMES = "games"
    CREATED_BY_USER__USERNAME = "created_by_user"


class GameOrderColumns(str, Enum):
    TITLE = "title"
    RELEASED_AT = "released_at"
    CREATED_AT = "created_at"
    SALES = "sales"
    PLATFORMS = "platforms"
    GENRES = "genres"
    CREATED_BY_COMPANY__TITLE = "created_by_company"
    CREATED_BY_USER__USERNAME = "created_by_user"


class SaleOrderColumns(str, Enum):
    AMOUNT = "amount"
    GAME__TITLE = "game"
    PLATFORM__TITLE = "platform"
    CREATED_BY_USER__USERNAME = "created_by_user"


class BackupOrderColumns(str, Enum):
    TITLE = "title"
    URL = "url"
    CREATED_AT = "created_at"
    CREATED_BY_USER__USERNAME = "created_by_user"


class CloudinaryResponse(BaseModel):
    url: AnyHttpUrl
    original_filename: str


class CommonQueries(BaseModel):
    skip: Optional[int] = Query(0, ge=0)
    limit: Optional[int] = Query(100, ge=1)
