import pymongo
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from uuid import UUID

from ....schemas.queuer import QueuerCreate, QueuerResponse, QueuerResponseAdmin, QueuerResponsePersonal, QueuerUpdate
from ....services.queuer import QueuerService
from ....models.admin import Admin
from ....api.deps.admin import get_current_admin
from ....services.queue_settings import QueueSettingsService

queuer_router = APIRouter()

@queuer_router.get("/queue", summary="Get the queue", response_model=List[QueuerResponse])
async def get_queue():
    res = await QueuerService.list_queuer_active()
    
    if res == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empty queue!"
        )

    return res

@queuer_router.get("/on-hold", summary="Get the on-hold queue", response_model=List[QueuerResponse])
async def get_hold_queue():
    res = await QueuerService.list_queuer_hold()
    
    if res == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empty queue!"
        )

    return res


@queuer_router.get("/{id}", summary="Get queuer by user ID", response_model=QueuerResponsePersonal)
async def get_queuer_by_uuid(id: UUID):
    res =  await QueuerService.queuer_by_user_id(id)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
    
    return res

@queuer_router.post("/", summary="Add queuer to queue", response_model=QueuerResponsePersonal, status_code=status.HTTP_201_CREATED)
async def add_queuer(data: QueuerCreate):
    queue_status = await QueueSettingsService.get_queue_setting_by_name("isQueueOn")
    if not queue_status.state:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Queue not active at this moment!"
        )
        
    try:
        return await QueuerService.add_queuer_service(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already submitted!"
        )
        
@queuer_router.put("/{id}", summary="Update on hold status", response_model=QueuerResponsePersonal)
async def update_queuer_by_uuid(data: QueuerUpdate, id: UUID):
    res = await QueuerService.update_queuer_data(data, id)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
    
    return res

# Requires Admin Auth
@queuer_router.get("/queue/admin", summary="Get the queue as admin", response_model=List[QueuerResponseAdmin])
async def get_queue_admin(admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized to access this data!")
    
    res = await QueuerService.list_queuer_active()
    
    if res == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empty queue!"
        )

    return res

@queuer_router.get("/on-hold/admin", summary="Get the on-hold queue as admin", response_model=List[QueuerResponseAdmin])
async def get_hold_queue_admin(admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized to access this data!")
    
    res = await QueuerService.list_queuer_hold()
    
    if res == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empty queue!"
        )

    return res

@queuer_router.delete("/admin/{id}", summary="Delete queuer from queue as admin", status_code=status.HTTP_410_GONE)
async def update_queuer_by_uuid(id: UUID, admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized for this action!")
    
    res = await QueuerService.delete_queuer(id)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
    
    return {"message": "Successfully removed the queuer!"}

# delete the whole active queue as admin
@queuer_router.delete("/queue/admin", summary="Delete the whole active queue as admin", status_code=status.HTTP_410_GONE)
async def update_queuer_by_uuid(admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized for this action!")
    
    res = await QueuerService.delete_active_queue()
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empty queue!")
    
    return {"message": "Successfully removed the active queue!"}

# delete the whole on hold queue as admin
@queuer_router.delete("/on-hold/admin", summary="Delete the whole on-hold queue as admin", status_code=status.HTTP_410_GONE)
async def update_queuer_by_uuid(admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized for this action!")
    
    res = await QueuerService.delete_hold_queue()
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empty queue!")
    
    return {"message": "Successfully removed the on-hold queue!"}

@queuer_router.delete("/{id}", summary="Delete queuer from queue", status_code=status.HTTP_410_GONE)
async def update_queuer_by_uuid(id: UUID):
    res = await QueuerService.delete_queuer(id)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
    
    return {"message": "Successfully removed the queuer!"}