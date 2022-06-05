from enum import Enum
from typing import Optional

from fastapi import Query
from pydantic import BaseModel


class Order(str, Enum):
    ASC = "asc"
    DESC = "desc"


class UserOrderColumns(str, Enum):
    CREATED_COMPANIES_ORDER = "created_companies"
    CREATED_PLATFORMS_ORDER = "created_platforms"
    CREATED_GAMES_ORDER = "created_games"
    CREATED_GENRES_ORDER = "created_genres"
    CREATED_SALES_ORDER = "created_sales"


class UserOrderColumn(BaseModel):
    column: UserOrderColumns
    order: Order


class CompanyOrderColumns(str, Enum):
    FOUNDED_AT = "founded_at"
    CREATED_AT = "created_at"


class CompanyOrderColumn(BaseModel):
    column: CompanyOrderColumns
    order: Order


class CommonQueries(BaseModel):
    skip: Optional[int] = Query(0, ge=0)
    limit: Optional[int] = Query(100, ge=1)
