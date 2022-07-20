import datetime
from typing import Optional

from fastapi import Query

from backend.custom_types import CommonQueries


class GameQueries(CommonQueries):
    title: Optional[str] = None
    released_start: datetime.date = None
    released_end: datetime.date = None
    created_by_user: Optional[str] = Query(None, regex=r"^\w+$")
    created_by_company: Optional[str] = None
