from enum import EnumMeta

from fastapi import HTTPException, Query, status

from backend.custom_types import Order, OrderColumn


class OrderValidation:
    def __init__(self, columns_enum: EnumMeta):
        self.enum = columns_enum

    def __call__(self, order: str = Query(default=None)) -> OrderColumn | None:
        if order is None:
            return None

        column, order = order.split("__")
        column = self.enum(column)
        order = Order(order)
        return OrderColumn(column=column, order=order)
