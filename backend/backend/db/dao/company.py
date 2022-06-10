import logging
from typing import Any, Optional

from fastapi import Depends
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import ClauseElement
from sqlalchemy.sql.functions import count

from backend.custom_types import Order, OrderColumn
from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session
from backend.db.utils import get_db_order
from backend.exceptions import CompanyNotFoundException

logger = logging.getLogger(__name__)


class CompanyDAO(BaseDAO[models.Company]):
    """Class for accessing company table."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.Company, session)
        self.default_options = [
            joinedload(models.Company.games).options(
                joinedload(models.Game.created_by_company),
            ),
        ]

    async def get_ordered_multi(
        self,
        expr: Optional[list[ClauseElement]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
        orders: Optional[list[OrderColumn]] = None,
        games: Optional[Order] = None,
    ) -> list[models.Company]:
        """Get multiple companies ordered by given orders.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            orders (Optional[list[OrderColumn]]): Order by.
            games (Optional[Order]): Order by amount of games.

        Returns:
            list[models.Company]: Companies.
        """

        if expr is None:
            expr = []
        if orders is None:
            orders = []

        orders_list = [
            get_db_order(order.order)(
                getattr(models.Company, order.column.value),
            )
            for order in orders
        ]

        if games is not None:
            prop = count(models.Company.games)
            order = get_db_order(games)(prop)
            orders_list.insert(0, order)

        stmt = (
            select(models.Company)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .order_by(*orders_list)
            .options(*self.default_options)
        )

        if games is not None:
            stmt = stmt.outerjoin(models.Company.games).group_by(models.Company.id)

        results = await self.session.execute(stmt)
        companies = results.unique().scalars().all()

        logger.debug(f"Got {len(companies)} companies.")
        return companies

    async def update(
        self,
        company_in: dict[str, Any],
        company_id: str,
    ) -> models.Company:
        """Update a company.

        Args:
            company_in (dict[str, Any]): Company data.
            company_id (str): Company ID.

        Returns:
            models.Company: Updated company.
        """

        db_company = await self.get(company_id)
        if not db_company:
            logger.error(f"Company {company_id} not found")
            raise CompanyNotFoundException(company_id)

        for field in company_in:
            setattr(db_company, field, company_in[field])

        self.session.add(db_company)
        await self.session.commit()
        await self.session.refresh(db_company)

        logger.debug(f"Updated company {db_company.title}")
        return db_company
