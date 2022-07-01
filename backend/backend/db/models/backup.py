from tortoise import fields, models


class Backup(models.Model):
    id = fields.UUIDField(pk=True, auto_generate=True, index=True)
    title = fields.CharField(max_length=512, unique=True, index=True)
    url = fields.CharField(1024)
    created_at = fields.DatetimeField(auto_now_add=True)

    created_by_user: fields.ForeignKeyRelation["User"] = fields.ForeignKeyField(
        "models.User",
        related_name="created_backups",
        null=True,
        on_delete=fields.SET_NULL,
    )


from backend.db.models.user import User  # noqa: E402
