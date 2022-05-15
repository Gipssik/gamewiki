from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CompanyBase(BaseModel):
    title: Optional[str]
    founded_at: Optional[datetime]
