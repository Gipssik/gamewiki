from typing import Optional
from uuid import UUID

from backend.web.api.sale.schema.sale_base import SaleBase


class SaleUpdate(SaleBase):
    game_id: Optional[UUID] = None
    platform_id: Optional[UUID] = None
