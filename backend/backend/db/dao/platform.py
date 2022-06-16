import logging
from typing import Optional

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Load, joinedload
from sqlalchemy.sql import ClauseElement

from backend.custom_types import Order, OrderColumn
from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session

logger = logging.getLogger(__name__)


class PlatformDAO(BaseDAO[models.Platform]):
    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.Platform, session)
        self.default_options: list[Load] = [
            joinedload(models.Platform.games),
            joinedload(models.Platform.sales),
        ]

    async def get_ordered_multi(
        self,
        expr: Optional[list[ClauseElement]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
        orders: Optional[list[OrderColumn]] = None,
    ) -> list[models.Platform]:
        """Get multiple platforms ordered by the given orders.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            orders (Optional[list[OrderColumn]]): Order columns.

        Returns:
            list[models.Platform]: Platforms.
        """

        # TODO: try to fix SQL

        # if orders is not None:
        #     orders_list: list[UnaryExpression] = []
        #
        #     for order in orders:
        #         ordering_column = getattr(models.Platform, order.column.value)
        #         prop = count(ordering_column)
        #         stmt = stmt.outerjoin(ordering_column)
        #         orders_list.append(get_db_order(order.order)(prop))
        #
        #     stmt = stmt.order_by(*orders_list).group_by(models.Platform.id)

        platforms = await self.get_multi(expr, offset, limit)

        if orders:
            platforms.sort(
                key=lambda platform: tuple(
                    len(getattr(platform, order.column.value))
                    * (1 if order.order == Order.ASC else -1)
                    for order in orders
                ),
            )

        logger.debug(f"Got {len(platforms)} platforms")
        return platforms
