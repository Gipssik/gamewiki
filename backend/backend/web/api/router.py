from fastapi.routing import APIRouter

from backend.web.api import auth, company, monitoring, user

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(company.router, prefix="/companies", tags=["companies"])
