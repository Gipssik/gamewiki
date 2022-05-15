from pydantic import EmailStr, Field

from .user_base import UserBase


class UserCreate(UserBase):
    username: str
    email: EmailStr
    hashed_password: str = Field(alias="password")
