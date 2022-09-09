from fastapi import APIRouter

from app.api.api_v1.handlers import user, admin

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