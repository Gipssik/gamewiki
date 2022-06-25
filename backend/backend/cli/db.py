from backend.db.dao import UserDAO
from backend.web.api.user.schema.user_create import UserCreate


async def get_user_dao() -> UserDAO:
    user_dao = UserDAO()
    return user_dao


async def primary_user_exists(user_dao: UserDAO) -> bool:
    user = await user_dao.get_primary_user()
    return user is not None


async def create_user(user_dao: UserDAO, user_create: UserCreate):
    user_create.is_superuser = True
    create_data = {"is_primary": True, **user_create.dict()}
    await user_dao.create(create_data)
