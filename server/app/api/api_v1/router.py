from fastapi import APIRouter

from app.api.api_v1.handlers import user, admin
from app.api.auth.jwt import auth_router

router = APIRouter()

# include routers
router.include_router(
    user.user_router,
    prefix="/user",
    tags=["user"]
)

router.include_router(
    admin.admin_router,
    prefix="/admin",
    tags=["admin"]
)

router.include_router(
    auth_router,
    prefix="/auth/admin",
    tags=["auth"]
)