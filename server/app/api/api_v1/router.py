from fastapi import APIRouter

from app.api.api_v1.handlers import queuer, admin, queue_settings
from app.api.auth.jwt import auth_router

router = APIRouter()

# include routers
router.include_router(
    queuer.queuer_router,
    prefix="/queuer",
    tags=["queuer"]
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

router.include_router(
    queue_settings.queue_settings_router,
    prefix="/set",
    tags=["queue_settings"]
)