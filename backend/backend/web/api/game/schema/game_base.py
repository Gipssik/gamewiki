from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class GameBase(BaseModel):
    title: Optional[str] = None
    released_at: Optional[datetime] = None
