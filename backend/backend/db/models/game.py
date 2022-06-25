from tortoise import fields, models


class Game(models.Model):
    id = fields.UUIDField(pk=True, auto_generate=True, index=True)
    title = fields.CharField(max_length=512, unique=True, index=True)
    released_at = fields.DateField()
    created_at = fields.DatetimeField(auto_now_add=True)

    created_by_user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User",
        related_name="created_games",
        null=True,
        on_delete=fields.SET_NULL,
    )
    created_by_company: fields.ForeignKeyRelation["Company"] = fields.ForeignKeyField(
        "models.Company",
        related_name="games",
    )

    platforms: fields.ManyToManyRelation["Platform"] = fields.ManyToManyField(
        "models.Platform",
        related_name="games",
        through="game_platform",
    )
    genres: fields.ManyToManyRelation["Genre"] = fields.ManyToManyField(
        "models.Genre",
        related_name="games",
        through="game_genre",
    )
    sales: fields.ReverseRelation["Sale"]


from backend.db.models.company import Company  # noqa: E402
from backend.db.models.genre import Genre  # noqa: E402
from backend.db.models.platform import Platform  # noqa: E402
from backend.db.models.sale import Sale  # noqa: E402
from backend.db.models.user import User  # noqa: E402
