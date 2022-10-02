from fastapi import APIRouter

from .handlers import queuer, admin, queue_settings, active_queuer
from ..auth.jwt import auth_router

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
    tags=["queue settings"]
)

router.include_router(
    active_queuer.active_queuer_router,
    prefix="/active-queuer",
    tags=["active queuer"]
)