import logging
from typing import Generic, Optional, Type, TypeVar

from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load
from sqlalchemy.sql import ClauseElement

from backend.db.base import Base

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class BaseDAO(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession) -> None:
        self.session = session
        self.__model = model
        self.default_options: list[Load] = []

    async def get(self, obj_id: str) -> ModelType | None:
        """Get object by id.

        Args:
            obj_id (str): ID of object to get.

        Returns:
            ModelType | None: ModelType object.
        """

        # TODO: Benchmark joinedload vs selectinload

        stmt = (
            select(self.__model)
            .where(self.__model.id == obj_id)
            .options(*self.default_options)
        )
        results = await self.session.execute(stmt)
        db_obj = results.scalar_one_or_none()

        if db_obj is None:
            return None

        logger.debug(f"Got {self.__model.__name__.lower()} {db_obj.id}")
        return db_obj

    async def get_multi(
        self,
        expr: Optional[ClauseElement | list[ClauseElement]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
    ) -> list[ModelType]:
        """Get multiple objects.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): Filter expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.

        Returns:
            list[ModelType]: List of objects.
        """

        if expr is None:
            expr = []
        elif isinstance(expr, ClauseElement):
            expr = [expr]

        stmt = (
            select(self.__model)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .options(*self.default_options)
        )

        results = await self.session.execute(stmt)
        objects = results.unique().scalars().all()

        logger.debug(f"Got {len(objects)} {self.__model.__tablename__}")
        return objects
