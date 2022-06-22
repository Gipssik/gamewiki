import logging
from typing import Any, Optional, Type
from uuid import UUID

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
from backend.db.base import Base
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session
from backend.db.models.genre import game_genre
from backend.db.models.platform import game_platform
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
        sort: Optional[list[OrderColumn]] = None,
    ) -> list[models.Game]:
        """Get multiple games ordered by the given orders.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            sort (Optional[list[OrderColumn]]): Order columns.

        Returns:
            list[models.Game]: Games.
        """

        if expr is None:
            expr = []

        stmt = (
            select(models.Game)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .options(*self.default_options)
        )

        # Models which appear in expr
        expr_models = [str(x.left).split(".")[0] for x in expr]  # type: ignore
        if "users" in expr_models:
            stmt = stmt.join(models.User)
        if "companies" in expr_models:
            stmt = stmt.join(models.Company)

        if sort:
            stmt = self._apply_sort(stmt, sort)

        results = await self.session.execute(stmt)
        games = results.unique().scalars().all()

        logger.debug(f"Got {len(games)} games.")
        return games

    def _apply_sort(self, stmt: select, sort: list[OrderColumn]) -> select:
        """Apply sorting to statement.

        Args:
            stmt (select): Statement.
            sort (list[OrderColumn]): Sort order.

        Returns:
            select: Statement.
        """

        order_columns = []
        group_by = [models.Game.id]

        # if statement was already joined with table
        joining = [table[0].name for table in getattr(stmt, "_setup_joins")]
        is_joined_with_users = "users" in joining
        is_joined_with_companies = "companies" in joining

        for param in sort:
            column = getattr(models.Game, param.column.value)

            # if column is a collection, we need to order by the count
            if isinstance(column.impl, CollectionAttributeImpl):
                if param.column.value != "platforms" and param.column.value != "genres":
                    stmt = stmt.outerjoin(column)
                column = count(column)
            # if column is a related field, we need to order by this field's caption
            elif isinstance(column.impl, ScalarObjectAttributeImpl):
                if (
                    param.column.value != "created_by_user" or not is_joined_with_users
                ) and (
                    param.column.value != "created_by_company"
                    or not is_joined_with_companies
                ):
                    stmt = stmt.outerjoin(column)
                column = GameDAO._get_column(column)
                group_by.append(column)

            order = get_db_order(param.order)(column)
            order_columns.append(order)

        stmt = stmt.order_by(*order_columns).group_by(*group_by)
        sorting = [param.column.value for param in sort]
        if "platforms" in sorting:
            stmt = (
                stmt.outerjoin(game_platform)
                .outerjoin(models.Platform)
                .outerjoin(game_platform.alias())
            )
        if "genres" in sorting:
            stmt = (
                stmt.outerjoin(game_genre)
                .outerjoin(models.Genre)
                .outerjoin(game_genre.alias())
            )

        if "platforms" in sorting and "genres" in sorting:
            stmt = stmt.outerjoin(game_genre.alias()).outerjoin(game_platform.alias())

        return stmt

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

        print(db_game.__dict__)

        if "genres" in game_in:
            genres = await self._get_relation_list(
                models.Genre,
                game_in["genres"],
            )

            db_game.genres = []
            db_game.genres = genres
            game_in.pop("genres")

        for field in game_in:
            setattr(db_game, field, game_in[field])

        self.session.add(db_game)
        await self.session.commit()

        db_game = await self.get(db_game.id)

        logger.debug(f"Updated game {db_game.id}")
        return db_game

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
