from app.models.queuer import Queuer
from typing import List
from uuid import UUID

from app.schemas.queuer import QueuerCreate, QueuerUpdate

class QueuerService:
    @staticmethod
    async def list_queuer_active() -> List[Queuer]:
        return await Queuer.find(Queuer.on_hold == False).to_list()

    @staticmethod
    async def list_queuer_hold() -> List[Queuer]:
        return await Queuer.find(Queuer.on_hold == True).to_list()
    
    @staticmethod
    async def queuer_by_user_id(user_id: UUID) -> Queuer:
        return await Queuer.find_one(Queuer.user_id == user_id)
    
    @staticmethod
    async def add_queuer_service(data: QueuerCreate) -> Queuer:
        queuer_in = Queuer(**data.dict())
        return await queuer_in.insert()
    
    @staticmethod
    async def update_queuer_data(data:QueuerUpdate, user_id: UUID):
        res = await QueuerService.queuer_by_user_id(user_id)
        
        await res.update({"$set": data.dict(exclude_unset=True)})
        await res.save()
        
        return res
    
    @staticmethod
    async def delete_queuer(user_id: UUID):
        res = await QueuerService.queuer_by_user_id(user_id)
        
        if not res:
            return False
        
        await res.delete()
        return True