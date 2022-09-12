from pydantic import BaseModel
from uuid import UUID

class Token(BaseModel):
    access_token: str
    refresh_token: str
    
class TokenPayload(BaseModel):
    sub: UUID = None
    exp: int = None