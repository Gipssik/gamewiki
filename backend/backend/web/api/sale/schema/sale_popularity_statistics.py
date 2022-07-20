from pydantic import BaseModel, Field


class SalePopularityStatistics(BaseModel):
    game__title: str = Field(alias="game")
    platform__title: str = Field(alias="platform")
    amount: int

    class Config:
        allow_population_by_field_name = True
