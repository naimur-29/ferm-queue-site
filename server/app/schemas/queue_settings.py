from pydantic import BaseModel

class QueueSettingsCreate(BaseModel):
    name: str
    state: str

class QueueSettingsUpdateState(BaseModel):
    state: str