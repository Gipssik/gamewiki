from backend.db.dao.company import CompanyDAO
from backend.db.dao.game import GameDAO
from backend.db.dao.genre import GenreDAO
from backend.db.dao.platform import PlatformDAO
from backend.db.dao.user import UserDAO

__all__ = [
    "UserDAO",
    "CompanyDAO",
    "PlatformDAO",
    "GenreDAO",
    "GameDAO",
]
