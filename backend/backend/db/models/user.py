from tortoise import fields, models


class User(models.Model):
    id = fields.UUIDField(pk=True, auto_generate=True, index=True)
    username = fields.CharField(max_length=32, unique=True, index=True)
    email = fields.CharField(max_length=128, unique=True, index=True)
    hashed_password = fields.CharField(max_length=256)
    is_superuser = fields.BooleanField(default=False)
    is_primary = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)
    salt = fields.CharField(1024)

    created_companies: fields.ReverseRelation["Company"]
    created_platforms: fields.ReverseRelation["Platform"]
    created_genres: fields.ReverseRelation["Genre"]
    created_games: fields.ReverseRelation["Game"]
    created_sales: fields.ReverseRelation["Sale"]
    created_backups: fields.ReverseRelation["Backup"]


from backend.db.models.backup import Backup  # noqa: E402
from backend.db.models.company import Company  # noqa: E402
from backend.db.models.game import Game  # noqa: E402
from backend.db.models.genre import Genre  # noqa: E402
from backend.db.models.platform import Platform  # noqa: E402
from backend.db.models.sale import Sale  # noqa: E402
