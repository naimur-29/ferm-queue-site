from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=100, description="username from youtube")
    link: str = Field(..., min_length=1, max_length=500, description="song link")
    message: str = Field(..., min_length=1, max_length=500, description="song link")