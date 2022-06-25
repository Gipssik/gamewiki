from backend.db import models
from backend.db.dao.base import BaseDAO


class CompanyDAO(BaseDAO[models.Company]):
    """Class for accessing company table."""

    def __init__(self) -> None:
        super().__init__(models.Company)
        self.related = [
            "created_by_user",
            "games",
        ]
