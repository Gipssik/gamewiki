from typing import Optional

from fastapi import Query

from backend.types import CommonQueries, Order


class CompanyQueries(CommonQueries):
    title: str
    founded_at: Optional[Order] = Order.DESC
    created_at: Optional[Order] = Order.DESC
    username_of_creator: str = Query(None, regex="^[a-zA-Z0-9_]+$")
