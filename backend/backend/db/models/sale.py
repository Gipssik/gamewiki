from tortoise import fields, models


class Sale(models.Model):
    class Meta:
        unique_together = (("game", "platform"),)

    id = fields.UUIDField(pk=True, auto_generate=True, index=True)
    amount = fields.BigIntField()

    game: fields.ForeignKeyRelation["Game"] = fields.ForeignKeyField(
        "models.Game",
        related_name="sales",
    )
    platform: fields.ForeignKeyRelation["Platform"] = fields.ForeignKeyField(
        "models.Platform",
        related_name="sales",
    )
    created_by_user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User",
        related_name="created_sales",
        null=True,
        on_delete=fields.SET_NULL,
    )


from backend.db.models.game import Game  # noqa: E402
from backend.db.models.platform import Platform  # noqa: E402
from backend.db.models.user import User  # noqa: E402
