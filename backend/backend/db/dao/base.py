import logging
from typing import Any, Generic, Optional, Type, TypeVar

from tortoise.functions import Count
from tortoise.models import Model

from backend.exceptions import ObjectNotFoundException

logger = logging.getLogger(__name__)
ModelType = TypeVar("ModelType", bound=Model)


class BaseDAO(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]) -> None:
        self.__model = model
        self.related: list[str] = []

    @property
    def name(self) -> str:
        return self.__model.__name__

    @property
    def model(self) -> Type[ModelType]:
        return self.__model

    async def get_count(self, expr: Optional[dict[str, Any]] = None) -> int:
        """Get amount of objects.

        Args:
            expr (dict): Filter expression.

        Returns:
            int: Amount of objects.
        """

        if expr is None:
            expr = {}

        amount = await self.__model.filter(**expr).count()

        logger.debug(f"Got amount of {self.name.lower()} {amount}")
        return amount

    async def get(self, obj_id: str) -> ModelType | None:
        """Get object by id.

        Args:
            obj_id (str): ID of object to get.

        Returns:
            ModelType | None: ModelType object.
        """

        db_obj = await self.__model.get_or_none(id=obj_id).prefetch_related(
            *self.related
        )

        if db_obj is not None:
            logger.debug(f"Got {self.name.lower()} {db_obj.id}")

        return db_obj

    async def get_multi(
        self,
        expr: Optional[dict[str, Any]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
        sort: Optional[list[str]] = None,
    ) -> list[ModelType]:
        """Get multiple objects ordered by the given orders.

        Args:
            expr (Optional[dict]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            sort (Optional[list[str]]): Order columns.

        Returns:
            list[ModelType]: Objects.
        """

        if expr is None:
            expr = {}

        count_sorts: dict[str, Count] = {}
        abs_sort = [x.lstrip("-") for x in sort]
        for field in self.__model._meta.fetch_fields - self.__model._meta.fk_fields:
            try:
                i = abs_sort.index(field)
            except ValueError:
                continue
            sort[i] += "_count"
            count_sorts[sort[i].lstrip("-")] = Count(field)

        stmt = (
            self.__model.filter(**expr)
            .offset(offset)
            .limit(limit)
            .annotate(**count_sorts)
            .order_by(*sort)
            .prefetch_related(*self.related)
        )

        objects = await stmt

        logger.debug(f"Got {len(objects)} {self.name.lower()}")
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

        db_obj = await self.__model.create(**obj_in, created_by_user_id=user_id)
        await db_obj.fetch_related(*self.related)

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

        c = await self.__model.filter(id=obj_id).update(**obj_in)
        if c != 1:
            logger.error(f"{self.name} {obj_id} not found")
            raise ObjectNotFoundException(obj_id)

        db_obj = await self.get(obj_id)

        logger.debug(f"Updated {self.name.lower()} {db_obj.id}")
        return db_obj

    async def delete(self, obj_id: str) -> None:
        """Delete object by id.

        Args:
            obj_id (str): ID of object to delete.
        """

        c = await self.__model.filter(id=obj_id).delete()

        if c != 1:
            logger.error(f"{self.name} {obj_id} not found")
            raise ObjectNotFoundException(obj_id)

        logger.debug(f"Deleted {self.name.lower()} {obj_id}")

    async def delete_multi(self, obj_ids: list[str]) -> None:
        """Delete multiple objects.

        Args:
            obj_ids (list[str]): IDs of objects to delete.
        """

        c = await self.__model.filter(id__in=obj_ids).delete()
