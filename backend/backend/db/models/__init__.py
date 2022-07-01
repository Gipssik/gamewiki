"""backend models."""
import pkgutil
from pathlib import Path

from backend.db.models.backup import Backup
from backend.db.models.company import Company
from backend.db.models.game import Game
from backend.db.models.genre import Genre
from backend.db.models.platform import Platform
from backend.db.models.sale import Sale
from backend.db.models.user import User


def load_all_models() -> None:
    """Load all models from this folder."""
    package_dir = Path(__file__).resolve().parent
    modules = pkgutil.walk_packages(
        path=[str(package_dir)],
        prefix="backend.db.models.",
    )
    for module in modules:
        __import__(module.name)  # noqa: WPS421


__all__ = [
    "Backup",
    "Company",
    "User",
    "Game",
    "Genre",
    "Platform",
    "Sale",
    "load_all_models",
]
