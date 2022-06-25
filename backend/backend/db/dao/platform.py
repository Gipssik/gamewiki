from backend.db import models
from backend.db.dao.base import BaseDAO


class PlatformDAO(BaseDAO[models.Platform]):
    """Class for accessing platform table"""

    def __init__(self) -> None:
        super().__init__(models.Platform)
