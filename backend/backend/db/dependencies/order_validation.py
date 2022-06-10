from enum import EnumMeta

from fastapi import HTTPException, Query, status

from backend.custom_types import Order, OrderColumn


class OrderValidation:
    def __init__(self, columns_enum: EnumMeta):
        self.enum = columns_enum

    def __call__(self, orders: list[str] = Query(default=[])) -> list[OrderColumn]:
        res: list[OrderColumn] = []
        try:
            for column_order in orders:
                column, order = column_order.split("__")
                column = self.enum(column)
                order = Order(order)
                res.append(OrderColumn(column=column, order=order))
        except ValueError as error:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(error),
            )
        return res
