from beanie import Document, Indexed
from uuid import UUID, uuid4
from pydantic import Field
from datetime import datetime

class User(Document):
    user_id: UUID = Field(default_factory=uuid4)
    username: str = Indexed(str, unique=True)
    link: str = Indexed(str, unique=True)
    message: str
    on_hold: bool = False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class Collection:
        name = "users"