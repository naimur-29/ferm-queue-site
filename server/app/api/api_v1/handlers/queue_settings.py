import pymongo
from fastapi import APIRouter, HTTPException, status, Depends

from ....schemas.queue_settings import QueueSettingsCreate, QueueSettingsUpdateState
from ....services.queue_settings import QueueSettingsService
from ....api.auth.jwt import get_current_admin
from ....models.admin import Admin

queue_settings_router = APIRouter()

@queue_settings_router.get("/{name}", summary="Get setting status by name", response_model=QueueSettingsCreate)
async def get_setting(name: str):
    res = await QueueSettingsService.get_queue_setting_by_name(name)
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Setting not found!")
    return res

@queue_settings_router.post("/", summary="Add an queue settings", response_model=QueueSettingsCreate, status_code=status.HTTP_201_CREATED)
async def create_queue_settings(data: QueueSettingsCreate, admin: Admin = Depends(get_current_admin)):
    if admin.active:
        try:
            return await QueueSettingsService.new_queuer_setting(data)
        except pymongo.errors.DuplicateKeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Exists!"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized to perform such task!"
        )
        
# Change/update settings status by name (only admin can change tho)
@queue_settings_router.put("/{name}", summary="Change/Update setting by name", response_model=QueueSettingsCreate)
async def update_setting_by_name(name: str, status: QueueSettingsUpdateState, admin: Admin = Depends(get_current_admin)):
    if admin.active:
        try:
            res = await QueueSettingsService.update_setting_status_by_name(name, status)
            if not res:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Setting not found!")
            return res
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong data!")
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized to perform such task!")