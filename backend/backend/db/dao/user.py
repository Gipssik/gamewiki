import logging
from typing import Any

from tortoise.expressions import Q

from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.exceptions import InvalidPasswordException, ObjectNotFoundException
from backend.security import hash_password, verify_password

logger = logging.getLogger(__name__)


class UserDAO(BaseDAO[models.User]):
    """Class for accessing user table"""

    def __init__(self) -> None:
        super().__init__(models.User)
        self.related = [
            "created_genres",
            "created_sales",
            "created_games",
            "created_platforms",
            "created_companies",
        ]

    async def create(self, user_in: dict[str, Any]) -> models.User:
        """Create user.

        Args:
            user_in (dict[str, Any]): User data.

        Returns:
            User: User object.
        """

        user_in["hashed_password"], user_in["salt"] = hash_password(
            user_in["password"],
        )
        user_in.pop("password", None)

        db_user = await self.model.create(**user_in)
        await db_user.fetch_related(*self.related)

        logger.debug(f"Created user {db_user.username}")
        return db_user

    async def update(self, user_in: dict[str, Any], user_id: str) -> models.User:
        """Update user.

        Args:
            user_in (dict[str, Any]): User data.
            user_id (str): ID of user to update.

        Returns:
            User: User object.
        """

        if "password" in user_in:
            hashed_password, salt = hash_password(user_in["password"])
            user_in.pop("password", None)
            user_in.update({"hashed_password": hashed_password, "salt": salt})

        db_user = await super().update(user_in, user_id)
        return db_user

    async def delete(self, user_id: str) -> None:
        """Delete user.

        Args:
            user_id (str): ID of user to delete.
        """

        c = await self.model.filter(Q(id=user_id) & Q(is_primary=False)).delete()

        if c != 1:
            logger.error(f"{self.name} {user_id} not found")
            raise ObjectNotFoundException(user_id)

        logger.debug(f"Deleted user {user_id}")

    async def delete_multi(self, user_ids: list[str]) -> None:
        """Delete multiple users.

        Args:
            user_ids (list[str]): IDs of users to delete.
        """

        await self.model.filter(Q(id__in=user_ids) & Q(is_primary=False)).delete()

    async def get_by_expr(self, **kwargs) -> models.User | None:
        """Get user by expression.

        Args:
            kwargs: Expression(s).

        Returns:
            User | None: User object.
        """

        user = await self.model.filter(**kwargs).get_or_none()

        # to avoid logging
        if not user:
            return None

        logger.debug(f"Got user {user.username}")
        return user

    async def authenticate(self, username: str, password: str) -> models.User:
        """Authenticate user.

        Args:
            username (str): Username.
            password (str): Password.

        Raises:
            ObjectNotFoundException: User not found.
            InvalidPasswordException: Invalid password.

        Returns:
            User: User object.
        """

        user = await self.get_by_expr(username=username)

        if not user:
            logger.error(f"User {username} not found")
            raise ObjectNotFoundException(f"User {username} not found")

        if not verify_password(password, user.salt, user.hashed_password):
            logger.error(f"User {username} password incorrect")
            raise InvalidPasswordException(f"User {username} password incorrect")

        logger.debug(f"Authenticated user {username}")
        return user

    async def get_primary_user(self) -> models.User | None:
        """Get primary user.

        Returns:
            User | None: User object.
        """

        user = await self.get_by_expr(is_primary=True)

        if not user:
            return None

        logger.debug(f"Got primary user {user.username}")
        return user
