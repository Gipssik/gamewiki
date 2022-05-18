import datetime
import uuid

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = sa.Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    username = sa.Column(sa.String(32), nullable=False, unique=True, index=True)
    email = sa.Column(sa.String, nullable=False, unique=True, index=True)
    hashed_password = sa.Column(sa.String, nullable=False)
    created_at = sa.Column(
        sa.DateTime,
        nullable=False,
        default=datetime.datetime.utcnow,
    )
    salt = sa.Column(sa.String, nullable=False)

    created_companies = relationship(
        "Company",
        backref="created_by_user",
        lazy="noload",
    )
    created_platforms = relationship(
        "Platform",
        backref="created_by_user",
        lazy="noload",
    )
    created_games = relationship("Game", backref="created_by_user", lazy="noload")
    created_genres = relationship("Genre", backref="created_by_user", lazy="noload")
    created_sales = relationship("Sale", backref="created_by_user", lazy="noload")
