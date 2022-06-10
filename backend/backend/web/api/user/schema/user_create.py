from pydantic import EmailStr, Field

from .user_base import UserBase


class UserCreate(UserBase):
    username: str = Field(min_length=4, max_length=20, regex=r"^\w+$")
    email: EmailStr
    password: str = Field(min_length=8)
