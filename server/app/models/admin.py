from beanie import Document, Indexed
from uuid import UUID, uuid4
from pydantic import Field, EmailStr
from datetime import datetime

class Admin(Document):
    id: UUID = Field(default_factory=uuid4)
    username: str = Indexed(str, unique=True)
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    first_name: str = ""
    last_name: str = ""
    disabled: bool = True
    
    def __repr__(self) -> str:
        return f"<Admin {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Admin):
            return self.email == other.email
        return False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    @classmethod
    async def by_email(self, email: str) -> "Admin":
        return await self.find_one(self.email == email)
    
    class Collection:
        name = "admins"