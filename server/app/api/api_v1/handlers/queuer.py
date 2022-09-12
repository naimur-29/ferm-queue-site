import pymongo
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from uuid import UUID

from app.schemas.queuer import QueuerCreate, QueuerResponse, QueuerResponseAdmin, QueuerResponsePersonal, QueuerUpdate
from app.services.queuer import QueuerService
from app.models.admin import Admin
from app.api.deps.admin import get_current_admin

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
    return await QueuerService.queuer_by_user_id(id)

@queuer_router.post("/", summary="Add queuer to queue", response_model=QueuerResponsePersonal, status_code=status.HTTP_201_CREATED)
async def add_queuer(data: QueuerCreate):
    try:
        return await QueuerService.add_queuer_service(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already submitted!"
        )
        
@queuer_router.put("/{id}", summary="Update on hold status", response_model=QueuerResponsePersonal)
async def update_queuer_by_uuid(data: QueuerUpdate, id: UUID):
    return await QueuerService.update_queuer_data(data, id)

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

@queuer_router.delete("/{id}", summary="Delete queuer from queue", status_code=status.HTTP_410_GONE)
async def update_queuer_by_uuid(id: UUID, admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized for this action!")
    
    res = await QueuerService.delete_queuer(id)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
    
    return {"message": "Successfully removed the queuer!"}