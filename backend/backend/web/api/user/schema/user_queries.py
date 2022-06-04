from typing import Optional

from fastapi import Query
from pydantic import validator

from backend.types import CommonQueries, Order, UserOrderColumns


class UserQueries(CommonQueries):
    username: Optional[str] = Query(None, regex=r"^[a-zA-Z0-9_]+$")
    email: Optional[str] = Query(None, regex=r"^[a-zA-Z0-9_\.\-@]+$")
    is_superuser: Optional[bool] = None
    is_primary: Optional[bool] = None
    created_at_order: Optional[Order] = Order.DESC
    extra_orders: list[str] = Query(default=[])  # TODO: fix openapi

    @validator("extra_orders")
    def validate_column_order(cls, v: list[str]):
        for column in v:
            col, order = column.split("__")
            col = UserOrderColumns(col)
            order = Order(order)
        return v
