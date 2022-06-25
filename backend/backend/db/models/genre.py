from tortoise import fields, models


class Genre(models.Model):
    id = fields.UUIDField(pk=True, auto_generate=True, index=True)
    title = fields.CharField(max_length=512, unique=True, index=True)
    founded_at = fields.DateField()
    created_at = fields.DatetimeField(auto_now_add=True)

    created_by_user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User",
        related_name="created_genres",
        null=True,
        on_delete=fields.SET_NULL,
    )
    games: fields.ManyToManyRelation["Game"]


from backend.db.models.game import Game  # noqa: E402
from backend.db.models.user import User  # noqa: E402
