import logging

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.db.dependencies.db import get_db_session

logger = logging.getLogger(__name__)


class CompanyDAO(BaseDAO[models.Company]):
    """Class for accessing company table."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)) -> None:
        super().__init__(models.Company, session)
        self.default_options = [
            joinedload(models.Company.games),
            joinedload(models.Company.created_by_user),
        ]
