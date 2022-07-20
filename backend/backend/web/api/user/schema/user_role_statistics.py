from pydantic import BaseModel


class UserRoleStatistics(BaseModel):
    is_superuser: bool
    users: int
