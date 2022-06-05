from datetime import date

from backend.web.api.company.schema.company_base import CompanyBase


class CompanyCreate(CompanyBase):
    title: str
    founded_at: date
