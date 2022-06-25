from tortoise import fields, models


class Platform(models.Model):
    id = fields.UUIDField(pk=True, auto_generate=True, index=True)
    title = fields.CharField(max_length=512, unique=True, index=True)

    created_by_user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User",
        related_name="created_platforms",
        null=True,
        on_delete=fields.SET_NULL,
    )
    games: fields.ManyToManyRelation["Game"]
    sales: fields.ReverseRelation["Sale"]


from backend.db.models.game import Game  # noqa: E402
from backend.db.models.sale import Sale  # noqa: E402
from backend.db.models.user import User  # noqa: E402
