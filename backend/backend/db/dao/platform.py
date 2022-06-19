import logging
from typing import Optional

from fastapi import Depends
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load, joinedload
from sqlalchemy.orm.attributes import CollectionAttributeImpl, ScalarObjectAttributeImpl
from sqlalchemy.sql import ClauseElement
from sqlalchemy.sql.functions import count

from backend.custom_types import OrderColumn
from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session
from backend.db.models.platform import game_platform
from backend.db.utils import get_db_order

logger = logging.getLogger(__name__)


class PlatformDAO(BaseDAO[models.Platform]):
    """Class for accessing platform table"""

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
        sort: Optional[list[OrderColumn]] = None,
    ) -> list[models.Platform]:
        """Get multiple platforms ordered by the given orders.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            sort (Optional[list[OrderColumn]]): Order columns.

        Returns:
            list[models.Platform]: Platforms.
        """

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

        if sort:
            stmt = self._apply_sort(stmt, sort)

        results = await self.session.execute(stmt)
        platforms = results.unique().scalars().all()

        logger.debug(f"Got {len(platforms)} platforms")
        return platforms

    def _apply_sort(self, stmt: select, sort: list[OrderColumn]) -> select:
        """Apply sorting to statement.

        Args:
            stmt (select): Statement.
            sort (list[OrderColumn]): Sort order.

        Returns:
            select: Statement.
        """

        order_columns = []
        group_by = [models.Platform.id]

        # if statement was already joined with users table
        is_joined_with_users = bool(getattr(stmt, "_setup_joins"))

        for param in sort:
            column = getattr(models.Platform, param.column.value)

            # if column is a collection, we need to order by the count
            if isinstance(column.impl, CollectionAttributeImpl):
                if param.column.value != "games":
                    stmt = stmt.outerjoin(column)
                column = count(column)
            # if column is a related field, we need to order by this field's caption
            elif isinstance(column.impl, ScalarObjectAttributeImpl):
                if param.column.value != "created_by_user" or not is_joined_with_users:
                    stmt = stmt.outerjoin(column)
                column = PlatformDAO._get_column(column)
                group_by.append(column)

            order = get_db_order(param.order)(column)
            order_columns.append(order)

        stmt = stmt.order_by(*order_columns).group_by(*group_by)
        # TODO: fix cartesian product when using created_by_user and games sorting
        if "games" in [param.column.value for param in sort]:
            stmt = (
                stmt.outerjoin(game_platform)
                .outerjoin(models.Game)
                .outerjoin(game_platform.alias())
            )

        return stmt
