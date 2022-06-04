from typing import Optional

from fastapi import Query
from pydantic import BaseModel

from backend.types.user import CreatedAtOrder


class UserQueries(BaseModel):
    skip: Optional[int] = Query(0, ge=0)
    limit: Optional[int] = Query(100, ge=1)
    username: Optional[str] = Query(None, regex=r"^[a-zA-Z0-9_]+$")
    email: Optional[str] = Query(None, regex=r"^[a-zA-Z0-9_\.\-]+$")
    is_superuser: Optional[bool] = None
    is_primary: Optional[bool] = None
    created_at_order: Optional[CreatedAtOrder] = CreatedAtOrder.DESC
