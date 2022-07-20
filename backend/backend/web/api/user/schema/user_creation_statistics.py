import datetime

from pydantic import BaseModel


class UserCreationStatistics(BaseModel):
    date: datetime.date
    users: int
