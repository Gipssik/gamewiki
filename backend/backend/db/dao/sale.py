import logging

from backend.db import models
from backend.db.dao.base import BaseDAO

logger = logging.getLogger(__name__)


class SaleDAO(BaseDAO[models.Sale]):
    def __init__(self):
        super().__init__(models.Sale)
        self.related = [
            "game",
            "platform",
            "created_by_user",
        ]

    async def get_popularity_statistics(self) -> list[dict]:
        data = (
            await self.model.all()
            .order_by("amount")
            .values("game__title", "platform__title", "amount")
        )
        return data
