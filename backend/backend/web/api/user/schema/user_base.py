from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: Optional[str] = Field(None, min_length=4, max_length=20, regex=r"^\w+$")
    email: Optional[EmailStr] = None
    is_superuser: Optional[bool] = False

    class Config:
        allow_population_by_field_name = True
