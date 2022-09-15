from pydantic import BaseModel

class QueueSettingsCreate(BaseModel):
    name: str
    state: bool = False

class QueueSettingsUpdateState(BaseModel):
    state: bool