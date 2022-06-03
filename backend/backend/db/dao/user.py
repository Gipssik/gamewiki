import logging
from typing import Any, Optional

from fastapi import Depends
from sqlalchemy import true
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import Load, joinedload
from sqlalchemy.sql.elements import ClauseElement, and_

from backend.db import models
from backend.db.dependencies.db import get_db_session
from backend.exceptions import InvalidPasswordException, UserNotFoundException
from backend.security import hash_password, verify_password

logger = logging.getLogger(__name__)


class UserDAO:
    """Class for accessing user table"""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session
        self.default_options: list[Load] = [
            joinedload(models.User.created_companies).joinedload(models.Company.games),
            joinedload(models.User.created_games).joinedload(models.Game.sales),
            joinedload(models.User.created_platforms).joinedload(models.Platform.games),
            joinedload(models.User.created_sales),
            joinedload(models.User.created_genres).joinedload(models.Genre.games),
        ]
        self.selectin_options: list[Load] = [
            joinedload(models.User.created_companies).selectinload(
                models.Company.games,
            ),
            joinedload(models.User.created_games).selectinload(models.Game.sales),
            joinedload(models.User.created_platforms).selectinload(
                models.Platform.games,
            ),
            joinedload(models.User.created_sales),
            joinedload(models.User.created_genres).selectinload(models.Genre.games),
        ]

    async def get(self, obj_id: str) -> models.User | None:
        """Get user by id.

        Args:
            obj_id (str): ID of user to get.

        Raises:
            UserNotFoundException: User not found.

        Returns:
            User | None: User object.
        """

        # TODO: Benchmark joinedload vs selectinload

        expr = (
            select(models.User)
            .where(models.User.id == obj_id)
            .options(*self.default_options)
        )
        results = await self.session.execute(expr)
        db_obj = results.scalar()

        if not db_obj:
            return None

        logger.debug(f"Got user {db_obj.username}")
        return db_obj

    async def get_multi(
        self,
        expr: Optional[ClauseElement | list[ClauseElement]] = None,
        offset: Optional[int] = 0,
        limit: Optional[int] = 100,
    ) -> list[models.User]:
        """Get multiple users.

        Args:
            expr (Optional[ClauseElement | list[ClauseElement]]): Filter expression.
            offset (Optional[int]): Offset.
            limit (Optional[int]): Limit.

        Returns:
            list[User]: List of users.
        """

        if expr is None:
            expr = []
        elif isinstance(expr, ClauseElement):
            expr = [expr]

        query = (
            select(models.User)
            .where(and_(True, *expr))
            .offset(offset)
            .limit(limit)
            .options(*self.default_options)
        )
        results = await self.session.execute(query)
        users = results.unique().scalars().all()

        logger.debug(f"Got {len(users)} users")
        return users

    async def create(self, obj_in: dict[str, Any]) -> models.User:
        """Create user.

        Args:
            obj_in (dict[str, Any]): User data.

        Returns:
            User: User object.
        """

        obj_in["hashed_password"], obj_in["salt"] = hash_password(
            obj_in["password"],
        )
        obj_in.pop("password", None)

        db_obj = models.User(**obj_in)
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)

        logger.debug(f"Created user {db_obj.username}")
        return db_obj

    async def update(self, obj_in: dict[str, Any], obj_id: str) -> models.User:
        """Update user.

        Args:
            obj_in (dict[str, Any]): User data.
            obj_id (str): ID of user to update.

        Returns:
            User: User object.
        """

        db_obj = await self.get(obj_id)
        if not db_obj:
            logger.error(f"User {obj_id} not found")
            raise UserNotFoundException(obj_id)

        if "password" in obj_in:
            hashed_password, salt = hash_password(obj_in["password"])
            obj_in.pop("password", None)
            obj_in.update({"hashed_password": hashed_password, "salt": salt})

        for field in obj_in:
            setattr(db_obj, field, obj_in[field])

        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)

        logger.debug(f"Updated user {db_obj.username}")
        return db_obj

    async def delete(self, obj_id: str) -> None:
        """Delete user.

        Args:
            obj_id (str): ID of user to delete.
        """

        db_obj = await self.get(obj_id)
        if not db_obj:
            logger.error(f"User {obj_id} not found")
            raise UserNotFoundException(obj_id)

        await self.session.delete(db_obj)
        await self.session.commit()
        logger.debug(f"Deleted user {db_obj.username}")

    async def get_by_expr(
        self,
        expr: ClauseElement | list[ClauseElement],
    ) -> models.User | None:
        """Get user by expression.

        Args:
            expr (ClauseElement | list[ClauseElement]): Expression(s).

        Raises:
            UserNotFoundException: User not found.

        Returns:
            User | None: User object.
        """

        if isinstance(expr, ClauseElement):
            expr = [expr]

        query = select(models.User).where(*expr).options(*self.default_options)
        results = await self.session.execute(query)
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
            UserNotFoundException: User not found.
            InvalidPasswordException: Invalid password.

        Returns:
            User: User object.
        """

        user = await self.get_by_expr(models.User.username == username)

        if not user:
            logger.error(f"User {username} not found")
            raise UserNotFoundException(f"User {username} not found")

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
