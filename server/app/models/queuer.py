from beanie import Document, Indexed
from uuid import UUID, uuid4
from pydantic import Field
from datetime import datetime

class Queuer(Document):
    user_id: UUID = Field(default_factory=uuid4)
    artist_name: Indexed(str)
    track_title: Indexed(str)
    youtube_username: Indexed(str, unique=True)
    link: Indexed(str, unique=True)
    message: Indexed(str) = ""
    on_hold: Indexed(int) = 0
    refreshed_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    def __repr__(self) -> str:
        return f"<Queuer {self.username}>"

    def __str__(self) -> str:
        return self.username

    def __hash__(self) -> int:
        return hash(self.username)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Queuer):
            return self.user_id == other.user_id
        return False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class Collection:
        name = "queuers"