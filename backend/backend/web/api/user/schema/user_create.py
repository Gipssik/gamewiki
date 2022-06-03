from pydantic import EmailStr, Field

from .user_base import UserBase


class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str = Field(min_length=8)
