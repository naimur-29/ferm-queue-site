from typing import List
from uuid import UUID

from ..models.queuer import Queuer
from ..models.submission_played import SubmissionPlayed
from ..schemas.submission_played import SubmissionPlayedCreate

class SubmissionPlayedService:
    @staticmethod
    async def list_queuer() -> List[SubmissionPlayed]:
        return await SubmissionPlayed.find_all().to_list()
    
    @staticmethod
    async def queuer_by_user_id(user_id: UUID) -> SubmissionPlayed:
        try:
            return await SubmissionPlayed.find_one(SubmissionPlayed.user_id == user_id)
        except:
            return False
    
    @staticmethod
    async def add_queuer_service(data: SubmissionPlayedCreate) -> SubmissionPlayed:
        queuer_in = SubmissionPlayed(**data.dict())
        return await queuer_in.insert()
  
    @staticmethod
    async def delete_queuer(user_id: UUID):
        res = await SubmissionPlayedService.queuer_by_user_id(user_id)
        
        if not res:
            return False
        
        await res.delete()
        return True
    
    @staticmethod
    async def delete_queue():
        submission_played = SubmissionPlayed.find_all()
        on_hold = Queuer.find(Queuer.on_hold == True)
        
        
        if not await submission_played.to_list() and not await on_hold.to_list():
            return False
        
        await submission_played.delete()
        await on_hold.delete()
        return True
