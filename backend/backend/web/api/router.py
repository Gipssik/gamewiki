from fastapi.routing import APIRouter

from backend.web.api.auth.endpoints import router as auth_router
from backend.web.api.company.endpoints import router as company_router
from backend.web.api.game.endpoints import router as game_router
from backend.web.api.genre.endpoints import router as genre_router
from backend.web.api.monitoring.endpoints import router as monitoring_router
from backend.web.api.platform.endpoints import router as platform_router
from backend.web.api.user.endpoints import router as user_router

api_router = APIRouter()
api_router.include_router(monitoring_router)
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(user_router, prefix="/users", tags=["users"])
api_router.include_router(company_router, prefix="/companies", tags=["companies"])
api_router.include_router(platform_router, prefix="/platforms", tags=["platforms"])
api_router.include_router(genre_router, prefix="/genres", tags=["genres"])
api_router.include_router(game_router, prefix="/games", tags=["games"])
