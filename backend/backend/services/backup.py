import concurrent.futures
import datetime
import subprocess

import aiofiles
import aiofiles.os
import aiohttp
import cloudinary.uploader

from backend.custom_types import CloudinaryResponse
from backend.db.dao import BackupDAO
from backend.settings import settings


def upload_backup(filename: str) -> CloudinaryResponse:
    """Uploads backup file to Cloudinary by file's name.

    Args:
        filename (str): File's name.

    Returns:
        CloudinaryResponse: Response from Cloudinary
    """

    r = cloudinary.uploader.upload(
        filename,
        folder="backups",
        public_id=filename,
        overwrite=True,
        resource_type="raw",
    )
    return CloudinaryResponse(**r)


async def download_backup(url: str) -> str:
    """Downloads file by url.

    Args:
        url (str): Url.

    Returns:
        str: Filename.
    """

    filename = url.split("/")[-1]
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status == 200:
                async with aiofiles.open(filename, "wb") as f:
                    await f.write(await resp.read())

    return filename


def remove_remote_backup(filename: str):
    """Removes backup file on Cloudinary.

    Args:
        filename (str): File's name.
    """

    filename = filename.rstrip(".dump")
    cloudinary.uploader.destroy(f"backups/{filename}.dump", resource_type="raw")


async def remove_backup_file(filename: str) -> None:
    """Removes file by its name.

    Args:
        filename (str): File's name.
    """

    if await aiofiles.os.path.exists(filename):
        await aiofiles.os.remove(filename)


def create_backup() -> str:
    """Creates backup using pg_dump util.

    Returns:
        str: File's name.
    """

    filename = f"backup-{datetime.datetime.utcnow()}.dump".replace(" ", "T")
    cmd = f"pg_dump -h {settings.db_host} -U {settings.db_user} -Fc {settings.db_base} -f {filename}".split()
    popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)

    popen.stdout.close()
    popen.wait()

    return filename


def restore_backup(filename: str) -> None:
    """Restores from backup using pg_restore util."""

    cmd = f"pg_restore -h {settings.db_host} -U {settings.db_user} -d {settings.db_base} --clean {filename}".split()
    popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)

    popen.stdout.close()
    popen.wait()


async def process_backup_creation(backup_dao: BackupDAO, user_id: str):
    """Processes creation of backup.

    Args:
        backup_dao (BackupDAO): Backup DAO.
        user_id (str): User's id.
    """

    filename = create_backup()
    response = upload_backup(filename)
    backup_in = {
        "title": response.original_filename,
        "url": str(response.url),
    }
    await backup_dao.create_by_user(backup_in, user_id)
    await remove_backup_file(filename)


def process_multi_backup_removal(titles: list[str]):
    """Processes removal of multiple remote backups.

    Args:
        titles (list[str]): List of backup titles.
    """

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for title in titles:
            futures.append(executor.submit(remove_remote_backup, title))
        for future in concurrent.futures.as_completed(futures):
            future.result()


async def process_backup_restoring(url: str):
    """Processes restoring of backup.

    Args:
        url (str): Url.
    """

    filename = await download_backup(url)
    remove_remote_backup(filename)
    restore_backup(filename)
    await remove_backup_file(filename)
