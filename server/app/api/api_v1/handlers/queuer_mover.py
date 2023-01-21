from fastapi import APIRouter, HTTPException, status, Depends
from uuid import UUID
import pymongo

from ....schemas.active_queuer import ActiveQueuerCreate
from ....services.queuer import QueuerService
from ....services.active_queuer import ActiveQueuerService
from ....models.admin import Admin
from ...deps.admin import get_current_admin

queuer_mover_router = APIRouter()

# Move queuer to active queue:
@queuer_mover_router.get("/{id}", summary="Move queuer to active queue", status_code=status.HTTP_201_CREATED)
async def get_queuer_by_uuid(id: UUID,admin: Admin = Depends(get_current_admin)):
    if not admin.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to access this data!"
        )
    
    queuer =  await QueuerService.queuer_by_user_id(id)
    
    if not queuer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
    
    try:
        # try posting new queuer to active queue if queuer is valid!
        res = await ActiveQueuerService.add_queuer_service(
            ActiveQueuerCreate(
                user_id = queuer.user_id,
                artist_name = queuer.artist_name,
                track_title = queuer.track_title,
                youtube_username = queuer.youtube_username,
                username = queuer.youtube_username.lower(),
                link = queuer.link,
                message = queuer.message
            )
        )
        
        # if post is successful delete queuer from queue
        if res:
            res = await QueuerService.delete_queuer(id)
    
        if not res:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Queuer not found!")
        
        return {"message": f"Successfully moved {queuer.youtube_username}!"}
    
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already Joined The Queue!"
        )