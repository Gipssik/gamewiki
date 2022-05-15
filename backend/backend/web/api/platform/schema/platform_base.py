from typing import Optional

from pydantic import BaseModel


class PlatformBase(BaseModel):
    title: Optional[str] = None
