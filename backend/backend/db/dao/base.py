import logging
from typing import Any, Generic, Optional, Type, TypeVar

from sqlalchemy import and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load
from sqlalchemy.sql import ClauseElement

from backend.db import models
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

        if db_obj is not None:
            logger.debug(f"Got {self.name.lower()} {db_obj.id}")

        return db_obj

    async def get_multi(
        self,
        expr: list[ClauseElement] = None,
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

        stmt = (
            select(self.__model)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .options(*self.default_options)
        )

        if self.name != "User" and any(
            ["users" in str(x.left) for x in expr],  # type: ignore
        ):
            stmt = stmt.join(models.User)

        results = await self.session.execute(stmt)
        objects = results.unique().scalars().all()

        logger.debug(f"Got {len(objects)} {self.__model.__tablename__}")
        return objects

    async def create_by_user(
        self,
        obj_in: dict[str, Any],
        user_id: str,
    ) -> ModelType:
        """Create a new object by user.

        Args:
            obj_in (dict[str, Any]): Object data.
            user_id (str): Creator ID.

        Returns:
            ModelType: Created object.
        """

        db_obj = self.__model(**obj_in, created_by_user_id=user_id)
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)

        logger.debug(f"Created {self.name.lower()} {db_obj.id}")
        return db_obj

    async def update(
        self,
        obj_in: dict[str, Any],
        obj_id: str,
    ) -> ModelType:
        """Update an object.

        Args:
            obj_in (dict[str, Any]): Object data.
            obj_id (str): Object ID.

        Returns:
            ModelType: Updated object.
        """

        db_obj = await self.get(obj_id)
        if not db_obj:
            logger.error(f"{self.name} {obj_id} not found")
            raise ObjectNotFoundException(obj_id)

        for field in obj_in:
            setattr(db_obj, field, obj_in[field])

        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)

        logger.debug(f"Updated {self.name.lower()} {db_obj.id}")
        return db_obj

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
            diff = set(obj_ids) - {str(x) for x in objects}
            logger.error(f"Some {self.__model.__tablename__} not found: {diff}")
            raise ObjectNotFoundException(f"{', '.join(diff)}")
