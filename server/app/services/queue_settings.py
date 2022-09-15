from app.models.queue_settings import QueueSettings
from app.schemas.queue_settings import QueueSettingsCreate, QueueSettingsUpdateState

class QueueSettingsService:
    @staticmethod
    async def new_queuer_setting(data: QueueSettingsCreate) -> QueueSettings:
        queuer_setting_in = QueueSettings(**data.dict())
        return await queuer_setting_in.insert()
    
    @staticmethod
    async def get_queue_setting_by_name(name: str) -> QueueSettings:
        queue_setting = await QueueSettings.find_one(QueueSettings.name == name)
        return queue_setting if queue_setting else False

    @staticmethod
    async def update_setting_status_by_name(name: str, data: QueueSettingsUpdateState) -> QueueSettings:
        try:
            queue_setting = await QueueSettingsService.get_queue_setting_by_name(name)
            await queue_setting.update({"$set": data.dict(exclude_unset=True)})
            await queue_setting.save()
        except:
            return False
        return queue_setting
            
        