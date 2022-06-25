from backend.settings import settings

MODELS_PATH = "backend.db.models."
MODELS_MODULES: list[str] = [  # noqa: WPS407
    MODELS_PATH + model
    for model in ["user", "company", "platform", "genre", "game", "sale"]
]

TORTOISE_CONFIG = {  # noqa: WPS407
    "connections": {
        "default": str(settings.db_url),
    },
    "apps": {
        "models": {
            "models": MODELS_MODULES + ["aerich.models"],
            "default_connection": "default",
        },
    },
}
