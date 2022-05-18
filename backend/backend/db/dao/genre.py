import logging

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db.dependencies.db import get_db_session

logger = logging.getLogger(__name__)


class GenreDAO:
    """Class for accessing genre table"""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session
        self.default_options = []
