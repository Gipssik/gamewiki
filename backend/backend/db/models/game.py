import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.db.base import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(512), nullable=False)
    released_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now)
    created_by_company_id = Column(
        UUID(as_uuid=True),
        ForeignKey("companies.id"),
        nullable=False,
    )
    created_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    sales = relationship("Sale", back_populates="game", lazy="noload")
    created_by_company = relationship("Company", back_populates="games", lazy="joined")
    platforms = relationship(
        "Platform",
        secondary="game_platform",
        back_populates="games",
        lazy="noload",
    )
    genres = relationship(
        "Genre",
        secondary="game_genre",
        back_populates="games",
        lazy="noload",
    )
    created_by_user = relationship(
        "User",
        back_populates="created_games",
        lazy="joined",
    )
