from typing import Optional

from backend.web.api.backup.schema import BackupInDB
from backend.web.api.user.schema.user_in_db import UserInDB


class Backup(BackupInDB):
    created_by_user: Optional[UserInDB] = None
