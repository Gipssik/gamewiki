from pypika.terms import Function
from tortoise.functions import Count

from backend.db import models
from backend.db.dao.base import BaseDAO


class DatePartTrunc:
    def __init__(self, part: str, field: str):
        if part not in ("YEAR", "MONTH", "DAY"):
            raise ValueError

        self.__part = part
        self.__field = field

    def __repr__(self) -> str:
        return f"{self.__part} from {self.__field}"


class CompanyDAO(BaseDAO[models.Company]):
    """Class for accessing company table."""

    def __init__(self) -> None:
        super().__init__(models.Company)
        self.related = [
            "created_by_user",
            "games",
        ]

    async def get_foundation_statistics(self) -> list[dict]:
        data = (
            await self.model.all()
            .annotate(
                year=Function("EXTRACT", DatePartTrunc("YEAR", "founded_at")),
                companies=Count("id"),
            )
            .group_by("year")
            .values("year", "companies")
        )
        return data

    async def get_games_statistics(self) -> list[dict]:
        data = (
            await self.model.all()
            .annotate(games_count=Count("games"))
            .values("title", "games_count")
        )
        return data
