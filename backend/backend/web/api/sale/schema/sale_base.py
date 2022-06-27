from typing import Optional

from pydantic import BaseModel


class SaleBase(BaseModel):
    amount: Optional[int] = None
