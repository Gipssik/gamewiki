from uuid import UUID

from pydantic import BaseModel


class SaleInDB(BaseModel):
    id: UUID
    amount: float

    class Config:
        orm_mode = True
