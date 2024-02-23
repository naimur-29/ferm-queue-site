import pymongo
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from uuid import UUID

from ....schemas.submission_played import SubmissionPlayedCreate, SubmissionPlayedResponseAdmin
from ....services.submission_played import SubmissionPlayedService
from ....models.admin import Admin
from ....api.deps.admin import get_current_admin

submission_played_router = APIRouter()

# @active_queuer_router.get("/queue", summary="Get the active queue", response_model=List[ActiveQueuerResponse])
# async def get_queue():
#     res = await ActiveQueuerService.list_queuer()
    
#     if res == []:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Empty queue!"
#         )

#     return res


# @active_queuer_router.get("/{id}", summary="Get active queuer by user ID", response_model=ActiveQueuerResponsePersonal)
# async def get_queuer_by_uuid(id: UUID):
#     res =  await ActiveQueuerService.queuer_by_user_id(id)
    
#     if not res:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Active Queuer not found!")
    
#     return res

# @submission_played_router.post("/", summary="Add queuer to 'submission played' queue", response_model=SubmissionPlayedResponseAdmin, status_code=status.HTTP_201_CREATED)
# async def add_queuer(data: SubmissionPlayedCreate, admin: Admin = Depends(get_current_admin)):
#     if not admin.active:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Unauthorized to access this data!"
#         )
        
#     try:
#         return await SubmissionPlayedService.add_queuer_service(data)
#     except pymongo.errors.DuplicateKeyError:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Already Joined The Queue!"
#         )
        
# @active_queuer_router.put("/{id}", summary="Update Active Queuer", response_model=ActiveQueuerResponsePersonal)
# async def update_queuer_by_uuid(data: ActiveQueuerUpdate, id: UUID):
#     res = await ActiveQueuerService.update_queuer_data(data, id)
    
#     if not res:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Active Queuer not found!")
    
#     return res

# Requires Admin Auth
@submission_played_router.get("/queue/admin", summary="Get the 'submission played' queue as admin", response_model=List[SubmissionPlayedResponseAdmin])
async def get_queue_admin(admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized to access this data!")
    
    res = await SubmissionPlayedService.list_queuer()
    
    if res == []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empty queue!"
        )

    return res

# delete the whole active queue as admin
@submission_played_router.delete("/queue/admin", summary="Delete the whole 'submission played' queue as admin", status_code=status.HTTP_410_GONE)
async def update_queuer_by_uuid(admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized for this action!")
    
    res = await SubmissionPlayedService.delete_queue()
    
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empty queue!")
    
    return {"message": "Successfully removed the 'submission played' & 'on hold' queuers!"}


# @active_queuer_router.delete("/{id}", summary="Delete active queuer from queue", status_code=status.HTTP_410_GONE)
# async def update_queuer_by_uuid(id: UUID):
#     res = await ActiveQueuerService.delete_queuer(id)
    
#     if not res:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Active Queuer not found!")
    
#     return {"message": "Successfully removed the active queuer!"}
