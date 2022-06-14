import logging
from typing import Optional

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import ClauseElement

from backend.custom_types import Order
from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session

logger = logging.getLogger(__name__)


class GenreDAO(BaseDAO[models.Genre]):
    """Class for accessing genre table."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.Genre, session)
        self.default_options = [
            joinedload(models.Genre.games).options(
                joinedload(models.Game.created_by_company),
            ),
        ]

    async def get_ordered_multi(
        self,
        expr: Optional[list[ClauseElement]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
        games: Optional[Order] = None,
    ) -> list[models.Genre]:
        """Get multiple genres ordered by amount of games.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): SQLAlchemy expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.
            games (Optional[Order]): Order by amount of games.

        Returns:
            list[models.Genre]: Genres.
        """

        genres = await self.get_multi(expr, offset, limit)

        if games:
            genres.sort(
                key=lambda x: len(x.games),
                reverse=games == Order.DESC,
            )

        logger.debug(f"Got {len(genres)} genres.")
        return genres
