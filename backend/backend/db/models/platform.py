import uuid

from sqlalchemy import Column, ForeignKey, String, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.db.base import Base

game_platform = Table(
    "game_platform",
    Base.metadata,
    Column(
        "game_id",
        ForeignKey("games.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    ),
    Column(
        "platform_id",
        ForeignKey("platforms.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    ),
)


class Platform(Base):
    __tablename__ = "platforms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), unique=True, nullable=False, index=True)
    created_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    games = relationship("Game", secondary=game_platform, backref="platforms")
    sales = relationship("Sales", backref="platform")
