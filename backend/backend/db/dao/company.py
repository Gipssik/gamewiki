import datetime

from dateutil.rrule import YEARLY, rrule
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
            .order_by("year")
            .values("year", "companies")
        )
        year_list = [int(d["year"]) for d in data]
        start_date = datetime.date(year=year_list[0], month=1, day=1)
        end_date = datetime.date.today()
        datetimes = rrule(freq=YEARLY, dtstart=start_date, until=end_date)
        years = map(lambda x: x.year, datetimes)
        new_years = set(years) - set(year_list)
        for y in new_years:
            data.append({"year": y, "companies": 0})
        return sorted(data, key=lambda x: x["year"])

    async def get_games_statistics(self) -> list[dict]:
        data = (
            await self.model.all()
            .annotate(games_count=Count("games"))
            .values("title", "games_count")
        )
        return data
