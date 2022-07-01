import logging
from datetime import datetime

from backend.db import models
from backend.db.dao.base import BaseDAO
from backend.exceptions import ObjectNotFoundException

logger = logging.getLogger(__name__)


class BackupDAO(BaseDAO[models.Backup]):
    def __init__(self):
        super().__init__(models.Backup)
        self.related = [
            "created_by_user",
        ]

    async def delete_multi(self, backup_ids: list[str]) -> list[str]:
        delete_titles: list[str] = []
        for backup_id in backup_ids:
            backup = await self.get(backup_id)
            if backup:
                delete_titles.append(backup.title)
                await backup.delete()

        return delete_titles

    async def delete(self, backup_id: str) -> str:
        backup = await self.get(backup_id)
        if not backup:
            logger.error(f"Backup {backup_id} not found")
            raise ObjectNotFoundException(backup_id)

        title = backup.title
        await backup.delete()
        logger.debug(f"Deleted backup {backup_id}")
        return title

    async def get_last(self, created_at: datetime) -> list[str]:
        """Returns backups titles, which were created after given date.

        Args:
            created_at (datetime): Date.

        Returns:
            list[str]: List of backups titles.
        """

        backups = await self.model.filter(created_at__gt=created_at)
        return [backup.title for backup in backups]
