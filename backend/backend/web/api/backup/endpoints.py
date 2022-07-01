from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status

from backend.custom_types import BackupOrderColumns
from backend.db import models
from backend.db.dao import BackupDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser
from backend.db.models.backup import Backup
from backend.exceptions import ObjectNotFoundException
from backend.services import (
    process_backup_creation,
    process_backup_restoring,
    process_multi_backup_removal,
    remove_remote_backup,
)
from backend.web.api.backup import schema
from backend.web.api.backup.schema.backup import Backup as BackupSchema

router = APIRouter()


@router.get("/", response_model=list[BackupSchema])
async def get_multi(
    response: Response,
    queries: schema.BackupQueries = Depends(),
    sort: list[str] = Depends(OrderValidation(BackupOrderColumns)),
    backup_dao: BackupDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> list[Backup]:
    """Get list of backups.

    Args:
        response (Response): Response.
        queries (BackupQueries, optional): Query parameters.
        sort (list[str], optional): Order parameters.
        backup_dao (BackupDAO, optional): Backup DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        list[Backup]: List of backups.
    """

    amount = await backup_dao.get_count()
    companies = await backup_dao.get_multi(
        offset=queries.skip,
        limit=queries.limit,
        sort=sort,
    )

    response.headers["X-Total-Count"] = str(amount)
    return companies


@router.post("/")
async def create(
    background_tasks: BackgroundTasks,
    backup_dao: BackupDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> dict:
    """Creates backup of database and uploads it to Cloudinary.

    Args:
        background_tasks (BackgroundTasks): Background tasks.
        backup_dao (BackupDAO, optional): Backup DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        Backup: Backup.
    """

    background_tasks.add_task(
        process_backup_creation,
        backup_dao,
        str(current_superuser.id),
    )
    return {"message": "Backup creation started in background."}


@router.post("/restore/{backup_id}")
async def restore(
    backup_id: UUID,
    background_tasks: BackgroundTasks,
    backup_dao: BackupDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> dict:
    """Restores database from backup.

    Args:
        backup_id (UUID): Backup id.
        background_tasks (BackgroundTasks): Background tasks.
        backup_dao (BackupDAO, optional): Backup DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        Backup: Backup.
    """

    backup = await backup_dao.get(str(backup_id))
    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found",
        )

    last_backups_titles = await backup_dao.get_last(backup.created_at)

    background_tasks.add_task(process_multi_backup_removal, last_backups_titles)
    background_tasks.add_task(process_backup_restoring, backup.url)
    return {"message": "Backup restoring started in background."}


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    background_tasks: BackgroundTasks,
    backup_ids: list[UUID],
    backup_dao: BackupDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete backups.

    Args:
        background_tasks (BackgroundTasks): Background tasks.
        backup_ids (list[UUID]): List of backup ids.
        backup_dao (BackupDAO, optional): Backup DAO.
        current_superuser (User, optional): Current superuser.
    """

    titles = await backup_dao.delete_multi([str(backup_id) for backup_id in backup_ids])
    background_tasks.add_task(process_multi_backup_removal, titles)


@router.delete("/{backup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    background_tasks: BackgroundTasks,
    backup_id: UUID,
    backup_dao: BackupDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete backups.

    Args:
        background_tasks (BackgroundTasks): Background tasks.
        backup_id (UUID): Backup id.
        backup_dao (BackupDAO, optional): Backup DAO.
        current_superuser (User, optional): Current superuser.
    """

    try:
        title = await backup_dao.delete(str(backup_id))
    except ObjectNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found",
        )
    else:
        background_tasks.add_task(remove_remote_backup, title)
