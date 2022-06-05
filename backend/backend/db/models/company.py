import datetime
import uuid

from sqlalchemy import Column, Date, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.db.base import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(512), unique=True, nullable=False, index=True)
    founded_at = Column(Date, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now)
    created_by_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    games = relationship("Game", back_populates="created_by_company", lazy="noload")
    created_by_user = relationship(
        "User",
        back_populates="created_companies",
        lazy="joined",
    )
