from fastapi import APIRouter

from .handlers import queuer, admin, queue_settings, active_queuer, queuer_mover, submission_played
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

router.include_router(
    queuer_mover.queuer_mover_router,
    prefix="/move",
    tags=["move queuer to active queue/up next(frontend ref.)"]
)

router.include_router(
    submission_played.submission_played_router,
    prefix="/submission-played",
    tags=["Submissions that's already been played!"]
)
