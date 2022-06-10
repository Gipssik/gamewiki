import logging
from typing import Any, Optional

from fastapi import Depends
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load, joinedload
from sqlalchemy.sql import ClauseElement

from backend.custom_types import OrderColumn
from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session
from backend.exceptions import PlatformNotFoundException

logger = logging.getLogger(__name__)


class PlatformDAO(BaseDAO[models.Platform]):
    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.Platform, session)
        self.default_options: list[Load] = [
            joinedload(models.Platform.games).options(
                joinedload(models.Game.created_by_company),
            ),
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

        print(orders)
        if expr is None:
            expr = []

        stmt = (
            select(models.Platform)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .options(*self.default_options)
        )

        if any(["users" in str(x.left) for x in expr]):  # type: ignore
            stmt = stmt.join(models.User)

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

        results = await self.session.execute(stmt)
        platforms = results.unique().scalars().all()

        if orders:
            platforms.sort(
                key=lambda x: [
                    getattr(x, order.column.value)
                    * (1 if order.order.value == "asc" else -1)
                    for order in orders
                ],
            )

        logger.debug(f"Got {len(platforms)} platforms")
        return platforms

    async def update(
        self,
        platform_in: dict[str, Any],
        platform_id: str,
    ) -> models.Platform:
        """Update a platform.

        Args:
            platform_in (dict[str, Any]): Platform data.
            platform_id (str): Platform ID.

        Returns:
            models.Platform: Updated platform.
        """

        db_platform = await self.get(platform_id)
        if not db_platform:
            logger.error(f"Platform {platform_id} not found")
            raise PlatformNotFoundException(platform_id)

        for field in platform_in:
            setattr(db_platform, field, platform_in[field])

        self.session.add(db_platform)
        await self.session.commit()
        await self.session.refresh(db_platform)

        logger.debug(f"Updated platform {db_platform.title}")
        return db_platform
