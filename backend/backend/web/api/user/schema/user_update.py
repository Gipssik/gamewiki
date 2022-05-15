from pydantic import Field

from .user_base import UserBase


class UserUpdate(UserBase):
    hashed_password: str = Field(alias="password")
