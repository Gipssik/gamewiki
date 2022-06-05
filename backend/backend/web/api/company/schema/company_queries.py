from typing import Optional

from fastapi import Query

from backend.types import CommonQueries, Order


class CompanyQueries(CommonQueries):
    title: Optional[str] = None
    created_by_user: Optional[str] = Query(None, regex="^[a-zA-Z0-9_]+$")
    games: Optional[Order] = None
