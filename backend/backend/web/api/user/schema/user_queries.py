from typing import Optional

from fastapi import Query
from pydantic import validator

from backend.custom_types import CommonQueries, Order


class UserQueries(CommonQueries):
    username: Optional[str] = Query(None, regex=r"^\w+$")
    email: Optional[str] = Query(None, regex=r"^[\w\.\-@]+$")
    is_superuser: Optional[bool] = None
    is_primary: Optional[bool] = None
