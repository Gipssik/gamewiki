from typing import Optional

from fastapi import Query

from backend.types import CommonQueries, Order


class UserQueries(CommonQueries):
    username: Optional[str] = Query(None, regex=r"^[a-zA-Z0-9_]+$")
    email: Optional[str] = Query(None, regex=r"^[a-zA-Z0-9_\.\-@]+$")
    is_superuser: Optional[bool] = None
    is_primary: Optional[bool] = None
    created_at_order: Optional[Order] = Order.DESC
