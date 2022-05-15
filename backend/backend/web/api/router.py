from fastapi.routing import APIRouter

from backend.web.api import auth, monitoring

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
