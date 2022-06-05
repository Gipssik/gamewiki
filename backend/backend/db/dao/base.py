import logging
from typing import Generic, Optional, Type, TypeVar

from sqlalchemy import and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load
from sqlalchemy.sql import ClauseElement

from backend.db.base import Base
from backend.exceptions import ObjectNotFoundException

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Base)


class BaseDAO(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession) -> None:
        self.session = session
        self.__model = model
        self.default_options: list[Load] = []

    @property
    def name(self) -> str:
        return self.__model.__name__

    async def get(self, obj_id: str) -> ModelType | None:
        """Get object by id.

        Args:
            obj_id (str): ID of object to get.

        Returns:
            ModelType | None: ModelType object.
        """

        stmt = (
            select(self.__model)
            .where(self.__model.id == obj_id)
            .options(*self.default_options)
        )
        results = await self.session.execute(stmt)
        db_obj = results.unique().scalar_one_or_none()

        if db_obj is None:
            return None

        logger.debug(f"Got {self.name.lower()} {db_obj.id}")
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

    async def delete(self, obj_id: str) -> None:
        """Delete object by id.

        Args:
            obj_id (str): ID of object to delete.
        """

        stmt = (
            delete(self.__model)
            .where(self.__model.id == obj_id)
            .returning(self.__model.id)
        )

        result = await self.session.execute(stmt)
        result.unique().scalar_one()
        logger.debug(f"Deleted {self.name.lower()} {obj_id}")

    async def delete_multi(self, obj_ids: list[str]) -> None:
        """Delete multiple objects.

        Args:
            obj_ids (list[str]): IDs of objects to delete.
        """

        stmt = (
            delete(self.__model)
            .where(self.__model.id.in_(obj_ids))
            .returning(self.__model.id)
        )
        results = await self.session.execute(stmt)
        objects = results.scalars().all()

        if len(objects) != len(obj_ids):
            intersection = set(obj_ids) - {str(x) for x in objects}
            logger.error(f"Some {self.__model.__tablename__} not found: {intersection}")
            raise ObjectNotFoundException(f"{', '.join(intersection)}")

        await self.session.execute(stmt)
