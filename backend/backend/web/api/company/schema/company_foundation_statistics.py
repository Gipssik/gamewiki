from pydantic import BaseModel


class CompanyFoundationStatistics(BaseModel):
    year: int
    companies: int
