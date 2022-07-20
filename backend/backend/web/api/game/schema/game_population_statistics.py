from pydantic import BaseModel


class GamePopulationStatistics(BaseModel):
    title: str
    sales_sum: int
