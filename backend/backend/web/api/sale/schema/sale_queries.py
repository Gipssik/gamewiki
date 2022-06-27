from typing import Optional

from fastapi import Query

from backend.custom_types import CommonQueries


class SaleQueries(CommonQueries):
    game: Optional[str] = None
    platform: Optional[str] = None
    created_by_user: Optional[str] = Query(None, regex=r"^\w+$")
