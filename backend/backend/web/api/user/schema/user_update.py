from typing import Optional

from pydantic import Field

from .user_base import UserBase


class UserUpdate(UserBase):
    password: Optional[str] = Field(min_length=8)
