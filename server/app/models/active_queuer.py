from beanie import Document, Indexed
from uuid import UUID
from pydantic import Field
from datetime import datetime

class ActiveQueuer(Document):
    user_id: UUID
    artist_name: str
    track_title: str
    youtube_username: str
    username: Indexed(str, unique=True)
    link: Indexed(str, unique=True)
    message: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<ActiveQueuer {self.username}>"

    def __str__(self) -> str:
        return self.username

    def __hash__(self) -> int:
        return hash(self.username)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, ActiveQueuer):
            return self.user_id == other.user_id
        return False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class Collection:
        name = "active_queuers"