import logging
from typing import Any

from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.exceptions import ObjectNotFoundException

logger = logging.getLogger(__name__)


class GameDAO(BaseDAO[models.Game]):
    """Class for accessing game table"""

    def __init__(self) -> None:
        super().__init__(models.Game)
        self.related = [
            "created_by_user",
            "created_by_company",
            "platforms",
            "genres",
            "sales__game",
            "sales__platform",
            "sales__created_by_user",
        ]

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

        db_game = await self.model.create(
            title=game_in["title"],
            released_at=game_in["released_at"],
            created_by_company_id=game_in["created_by_company_id"],
            created_by_user_id=user_id,
        )

        if "genres" in game_in:
            genres = await models.Genre.filter(id__in=game_in["genres"])
            await db_game.genres.add(*genres)

        if "platforms" in game_in:
            platforms = await models.Platform.filter(id__in=game_in["platforms"])
            await db_game.platforms.add(*platforms)

        await db_game.fetch_related(*self.related)

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

        db_game = await self.get(game_id)
        if not db_game:
            logger.error(f"Game {game_id} not found")
            raise ObjectNotFoundException(game_id)

        if "genres" in game_in:
            genres = await models.Genre.filter(id__in=game_in["genres"])
            await db_game.genres.add(*genres)

            to_remove: list[models.Genre] = []
            for genre in db_game.genres:
                if genre not in genres:
                    to_remove.append(genre)

            if to_remove:
                await db_game.genres.remove(*to_remove)
            game_in.pop("genres")

        if "platforms" in game_in:
            platforms = await models.Platform.filter(id__in=game_in["platforms"])
            await db_game.platforms.add(*platforms)

            to_remove: list[models.Platform] = []
            for platform in db_game.platforms:
                if platform not in platforms:
                    to_remove.append(platform)

            if to_remove:
                await db_game.platforms.remove(*to_remove)
            game_in.pop("platforms")

        for field in game_in:
            setattr(db_game, field, game_in[field])

        await db_game.save()
        db_game = await self.model.get(id=game_id).prefetch_related(*self.related)

        logger.debug(f"Updated game {db_game.id}")
        return db_game
