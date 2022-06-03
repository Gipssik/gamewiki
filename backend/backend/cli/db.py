from functools import wraps
from typing import Callable

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from backend.db.dao.user import UserDAO
from backend.settings import settings
from backend.web.api.user.schema.user_create import UserCreate


def get_db_engine() -> AsyncEngine:
    db_url = str(settings.db_url)
    return create_async_engine(db_url, isolation_level="AUTOCOMMIT")


def db_session(func: Callable) -> Callable:
    @wraps(func)
    async def wrapper(*args, **kwargs):
        engine = get_db_engine()
        async_session = sessionmaker(
            engine,
            autocommit=False,
            class_=AsyncSession,
        )

        async with engine.begin() as connection:
            async with async_session(bind=connection) as session:
                return await func(session, *args, **kwargs)

    return wrapper


async def get_user_dao(session: AsyncSession) -> UserDAO:
    user_dao = UserDAO(session)
    return user_dao


async def primary_user_exists(user_dao: UserDAO) -> bool:
    user = await user_dao.get_primary_user()
    return user is not None


async def create_user(user_dao: UserDAO, user_create: UserCreate):
    user_create.is_superuser = True
    create_data = {"is_primary": True, **user_create.dict()}
    await user_dao.create(create_data)
