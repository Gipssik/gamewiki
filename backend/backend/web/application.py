from importlib import metadata

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse
from fastapi.routing import APIRoute

from backend.web.api.router import api_router
from backend.web.lifetime import shutdown, startup


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title="backend",
    description="Backend API for gamewiki",
    version=metadata.version("backend"),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    default_response_class=UJSONResponse,
    generate_request_id=custom_generate_unique_id,
)

app.on_event("startup")(startup(app))
app.on_event("shutdown")(shutdown(app))

app.include_router(router=api_router, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
