from pydantic import BaseModel


class CompanyGamesStatistics(BaseModel):
    title: str
    games_count: int
