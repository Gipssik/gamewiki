from typing import Optional

from fastapi import Query

from backend.custom_types import CommonQueries, Order


class GenreQueries(CommonQueries):
    title: Optional[str] = None
    created_by_user: Optional[str] = Query(None, regex=r"^\w+$")
    games: Optional[Order] = None
