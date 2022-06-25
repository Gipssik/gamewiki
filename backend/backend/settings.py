from pathlib import Path
from tempfile import gettempdir
from typing import Optional

from pydantic import BaseSettings
from yarl import URL

TEMP_DIR = Path(gettempdir())


class Settings(BaseSettings):
    """Application settings."""

    access_token_expire_minutes: int = 60 * 24 * 30  # 30 days
    encryption_algorithm: str = "HS256"
    host: str = "127.0.0.1"
    port: int = 8000
    # quantity of workers for uvicorn
    workers_count: int = 1
    # Enable uvicorn reloading
    reload: bool = True
    db_echo: bool = True

    # Variables from environment
    secret_key: Optional[str] = None
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "backend"
    db_pass: str = "backend"
    db_base: str = "backend"

    @property
    def db_url(self) -> URL:
        """
        Assemble database URL from settings.

        :return: database URL.
        """
        return URL.build(
            scheme="postgres",
            host=self.db_host,
            port=self.db_port,
            user=self.db_user,
            password=self.db_pass,
            path=f"/{self.db_base}",
        )

    class Config:
        env_file = ".env"
        env_prefix = "BACKEND_"
        env_file_encoding = "utf-8"


settings = Settings()
