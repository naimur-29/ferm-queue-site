from typing import List
from uuid import UUID

from ..models.active_queuer import ActiveQueuer
from ..schemas.active_queuer import ActiveQueuerCreate, ActiveQueuerUpdate

class ActiveQueuerService:
    @staticmethod
    async def list_queuer() -> List[ActiveQueuer]:
        return await ActiveQueuer.find_all().to_list()
    
    @staticmethod
    async def queuer_by_user_id(user_id: UUID) -> ActiveQueuer:
        try:
            return await ActiveQueuer.find_one(ActiveQueuer.user_id == user_id)
        except:
            return False
    
    @staticmethod
    async def add_queuer_service(data: ActiveQueuerCreate) -> ActiveQueuer:
        queuer_in = ActiveQueuer(**data.dict())
        return await queuer_in.insert()
    
    @staticmethod
    async def update_queuer_data(data: ActiveQueuerUpdate, user_id: UUID):
        try:
            res = await ActiveQueuerService.queuer_by_user_id(user_id)
            
            await res.update({"$set": data.dict(exclude_unset=True)})
            await res.save()
        except:
            res = False
        
        return res
    
    @staticmethod
    async def delete_queuer(user_id: UUID):
        res = await ActiveQueuerService.queuer_by_user_id(user_id)
        
        if not res:
            return False
        
        await res.delete()
        return True
    
    @staticmethod
    async def delete_active_queue():
        res = ActiveQueuer.find_all()
        
        if not await res.to_list():
            return False
        
        await res.delete()
        return True