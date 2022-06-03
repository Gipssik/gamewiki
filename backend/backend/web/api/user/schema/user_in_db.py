from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserInDB(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    is_superuser: bool
    is_primary: bool
    created_at: datetime

    class Config:
        orm_mode = True
