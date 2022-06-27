from uuid import UUID

from backend.web.api.sale.schema.sale_base import SaleBase


class SaleCreate(SaleBase):
    amount: int
    game_id: UUID
    platform_id: UUID
