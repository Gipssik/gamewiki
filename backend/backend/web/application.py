from importlib import metadata

from fastapi import FastAPI
from fastapi.responses import UJSONResponse

from backend.web.api.router import api_router
from backend.web.lifetime import shutdown, startup


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    app = FastAPI(
        title="backend",
        description="API for GameWiki",
        version=metadata.version("backend"),
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
    )

    app.on_event("startup")(startup(app))
    app.on_event("shutdown")(shutdown(app))

    app.include_router(router=api_router, prefix="/api")

    return app
