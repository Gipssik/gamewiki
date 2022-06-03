from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class UserBase(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_superuser: Optional[bool] = False

    @validator("username")
    def validate_username(cls, v: str):
        if not v.replace("_", "").isalnum():
            raise ValueError("Username must be alphanumeric plus '_' sign")
        return v

    class Config:
        allow_population_by_field_name = True
