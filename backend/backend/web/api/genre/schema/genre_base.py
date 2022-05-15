from typing import Optional

from pydantic import BaseModel


class GenreBase(BaseModel):
    title: Optional[str] = None
