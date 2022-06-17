from enum import EnumMeta

from fastapi import HTTPException, Query, status

from backend.custom_types import Order, OrderColumn


class OrderValidation:
    def __init__(self, columns_enum: EnumMeta):
        self.enum = columns_enum

    def __call__(self, sort: str = Query(default=None)) -> list[OrderColumn]:
        if sort is None:
            return []

        params = [s.lstrip("+") for s in sort.split(",")]
        order_columns: list[OrderColumn] = []
        for param in params:
            order = Order.DESC if param.startswith("-") else Order.ASC
            column = param.lstrip("-")

            if column.upper() not in self.enum.__members__:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid order column: {param}",
                )
            order_columns.append(OrderColumn(column=self.enum(column), order=order))

        return order_columns
