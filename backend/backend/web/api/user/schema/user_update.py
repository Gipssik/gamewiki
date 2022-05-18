from typing import Optional

from pydantic import Field

from .user_base import UserBase


class UserUpdate(UserBase):
    hashed_password: Optional[str] = Field(None, alias="password")
