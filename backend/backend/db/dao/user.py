import logging
from typing import Any

from fastapi import Depends
from sqlalchemy import delete, true
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load, joinedload
from sqlalchemy.sql.elements import ClauseElement

from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session
from backend.exceptions import InvalidPasswordException, ObjectNotFoundException
from backend.security import hash_password, verify_password

logger = logging.getLogger(__name__)


class UserDAO(BaseDAO[models.User]):
    """Class for accessing user table"""

    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.User, session)
        self.default_options: list[Load] = [
            joinedload(models.User.created_companies),
            joinedload(models.User.created_games),
            joinedload(models.User.created_platforms),
            joinedload(models.User.created_sales),
            joinedload(models.User.created_genres),
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

        db_user = models.User(**user_in)
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)

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

        db_user = await self.get(user_id)
        if not db_user:
            logger.error(f"User {user_id} not found")
            raise ObjectNotFoundException(user_id)

        if "password" in user_in:
            hashed_password, salt = hash_password(user_in["password"])
            user_in.pop("password", None)
            user_in.update({"hashed_password": hashed_password, "salt": salt})

        for field in user_in:
            setattr(db_user, field, user_in[field])

        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)

        logger.debug(f"Updated user {db_user.username}")
        return db_user

    async def delete(self, user_id: str) -> None:
        """Delete user.

        Args:
            user_id (str): ID of user to delete.
        """

        stmt = (
            delete(models.User)
            .where(
                (models.User.id == user_id) & models.User.is_primary.is_(False),
            )
            .returning(models.User.id)
        )

        result = await self.session.execute(stmt)
        result.unique().scalar_one()
        logger.debug(f"Deleted user {user_id}")

    async def delete_multi(self, user_ids: list[str]) -> None:
        """Delete multiple users.

        Args:
            user_ids (list[str]): IDs of users to delete.
        """

        stmt = (
            delete(models.User)
            .where(
                models.User.id.in_(user_ids) & models.User.is_primary.is_(False),
            )
            .returning(models.User.id)
        )
        results = await self.session.execute(stmt)
        users = results.scalars().all()

        if len(users) != len(user_ids):
            diff = set(user_ids) - {str(x) for x in users}
            logger.error(f"Some users not found: {diff}")
            raise ObjectNotFoundException(f"{', '.join(diff)}")

        await self.session.execute(stmt)

    async def get_by_expr(
        self,
        expr: ClauseElement | list[ClauseElement],
    ) -> models.User | None:
        """Get user by expression.

        Args:
            expr (ClauseElement | list[ClauseElement]): Expression(s).

        Returns:
            User | None: User object.
        """

        if isinstance(expr, ClauseElement):
            expr = [expr]

        stmt = select(models.User).where(*expr).options(*self.default_options)
        results = await self.session.execute(stmt)
        user = results.scalar()

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

        user = await self.get_by_expr(models.User.username == username)

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

        user = await self.get_by_expr(models.User.is_primary == true())

        if not user:
            return None

        logger.debug(f"Got primary user {user.username}")
        return user
