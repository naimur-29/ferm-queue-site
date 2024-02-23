from beanie import Document, Indexed
from uuid import UUID
from pydantic import Field
from datetime import datetime

class SubmissionPlayed(Document):
	user_id: UUID
	artist_name: str
	track_title: str
	youtube_username: str
	username: str
	link: str
	message: str = ""
	created_at: datetime = Field(default_factory=datetime.utcnow)
	
	def __repr__(self) -> str:
		return f"<SubmissionPlayed {self.username}>"
	
	def str(self) -> str:
		return self.username
	
	def __hash__(self) -> int:
		return hash(self.username)
	
	def __eq__(self, other: object) -> bool:
		if isinstance(other, SubmissionPlayed):
			return self.user_id == other.user_id
		return False
	
	@property
	def create(self) -> datetime:
		return self.id.generation_time
	
	class Collection:
		name = "submission_played"
