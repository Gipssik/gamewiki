from typing import Optional

from fastapi import Query

from backend.custom_types import CommonQueries


class PlatformQueries(CommonQueries):
    title: Optional[str] = None
    created_by_user: Optional[str] = Query(None, regex=r"^\w+$")
