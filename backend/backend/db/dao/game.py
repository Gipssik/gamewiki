import logging
from typing import Any, Optional, Type
from uuid import UUID

from fastapi import Depends
from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load, joinedload
from sqlalchemy.sql import ClauseElement

from backend.custom_types import Order, OrderColumn
from backend.db import models
from backend.db.base import Base
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session
from backend.db.utils import get_db_order
from backend.exceptions import ObjectNotFoundException

logger = logging.getLogger(__name__)


class GameDAO(BaseDAO[models.Game]):
    """Class for accessing game table"""

    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.Game, session)
        self.default_options: list[Load] = [
            joinedload(models.Game.sales),
            joinedload(models.Game.platforms),
            joinedload(models.Game.genres),
        ]

    async def get_ordered_multi(
        self,
        expr: Optional[list[ClauseElement]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
        orders: Optional[list[OrderColumn]] = None,
    ) -> list[models.Game]:
        """Get multiple games ordered by the given orders.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            orders (Optional[list[OrderColumn]]): Order columns.

        Returns:
            list[models.Game]: Games.
        """

        if expr is None:
            expr = []

        date_orders_list = []
        if orders:
            date_orders_list = [
                get_db_order(order.order)(getattr(models.Game, order.column.value))
                for order in orders
                if order.column.value.endswith("_at")
            ]

        stmt = (
            select(models.Game)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .order_by(*date_orders_list)
            .options(*self.default_options)
        )

        # Models which appear in expr
        expr_models = [str(x.left).split(".")[0] for x in expr]  # type: ignore
        if "users" in expr_models:
            stmt = stmt.join(models.User)
        if "companies" in expr_models:
            stmt = stmt.join(models.Company)

        results = await self.session.execute(stmt)
        games = results.unique().scalars().all()

        if orders:
            games.sort(
                key=lambda game: tuple(
                    len(getattr(game, order.column.value))
                    * (1 if order.order == Order.ASC else -1)
                    for order in orders
                    if not order.column.value.endswith("_at")
                ),
            )

        logger.debug(f"Got {len(games)} games.")
        return games

    async def create_by_user(
        self,
        game_in: dict[str, Any],
        user_id: str,
    ) -> models.Game:
        """Create a new game.

        Args:
            game_in (dict[str, Any]): Game data.
            user_id (str): User ID.

        Returns:
            models.Game: Game.
        """

        db_game = models.Game(
            title=game_in["title"],
            released_at=game_in["released_at"],
            created_by_company_id=game_in["created_by_company_id"],
            created_by_user_id=user_id,
        )

        if "genres" in game_in:
            genres = await self._get_relation_list(
                models.Genre,
                game_in["genres"],
            )

            db_game.genres = genres

        if "platforms" in game_in:
            platforms = await self._get_relation_list(
                models.Platform,
                game_in["platforms"],
            )

            db_game.platforms = platforms

        self.session.add(db_game)
        await self.session.commit()

        db_game = await self.get(db_game.id)

        logger.debug(f"Created game {db_game.id}")
        return db_game

    async def update(
        self,
        game_in: dict[str, Any],
        game_id: str,
    ) -> models.Game:
        """Update a game.

        Args:
            game_in (dict[str, Any]): Game data.
            game_id (str): Game ID.

        Returns:
            models.Game: Game.
        """

        # TODO: fix and finish game update
        db_game = await self.get(game_id)
        if not db_game:
            logger.error(f"Game {game_id} not found.")
            raise ObjectNotFoundException(game_id)

        return db_game

        # if "genres" in game_in:
        #     genres = await self._get_relation_list(
        #         models.Genre, game_in["genres"]
        #     )
        #
        #     db_game.genres = []
        #     db_game.genres = genres
        #
        # self.session.add(db_game)
        # await self.session.commit()
        #
        # db_game = await self.get(db_game.id)
        #
        # logger.debug(f"Updated game {db_game.id}")
        # return db_game

    async def _get_relation_list(
        self,
        model: Type[Base],
        relation_list: list[UUID],
    ) -> list[Base]:
        """Process a list of relation IDs.

        Args:
            model (Base): Model.
            relation_list (list[UUID]): Relation IDs.

        Returns:
            list[Base]: Relation models.
        """

        stmt = select(model).where(model.id.in_(relation_list))
        results = await self.session.execute(stmt)
        objects = results.unique().scalars().all()

        if len(objects) != len(relation_list):
            diff = set(relation_list) - set(x.id for x in objects)
            raise ObjectNotFoundException(
                f"{model.__name__}: {', '.join(map(str, diff))}",
            )

        return objects
