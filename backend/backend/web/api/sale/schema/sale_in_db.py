from uuid import UUID

from pydantic import BaseModel


class SaleInDB(BaseModel):
    id: UUID
    amount: int

    class Config:
        orm_mode = True
