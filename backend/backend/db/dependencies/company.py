from fastapi import HTTPException, Query, status

from backend.types import CompanyOrderColumn, CompanyOrderColumns, Order


def validate_orders(orders: list[str] = Query(default=[])) -> list[CompanyOrderColumn]:
    res: list[CompanyOrderColumn] = []
    try:
        for column in orders:
            col, order = column.split("__")
            col = CompanyOrderColumns(col)
            order = Order(order)
            res.append(CompanyOrderColumn(order=order, column=col))
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        )
    return res
