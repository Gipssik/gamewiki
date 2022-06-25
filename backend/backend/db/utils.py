from typing import Any, Callable

from sqlalchemy import asc, desc
from sqlalchemy.sql.elements import UnaryExpression
from sqlalchemy.sql.sqltypes import NullType

from backend.custom_types import Order


def get_db_order(order: Order) -> Callable[[Any], UnaryExpression[NullType]]:
    return desc if order == Order.DESC else asc
