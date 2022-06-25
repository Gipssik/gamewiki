from backend.db import models
from backend.db.dao.base import BaseDAO


class GenreDAO(BaseDAO[models.Genre]):
    """Class for accessing genre table."""

    def __init__(self) -> None:
        super().__init__(models.Genre)
