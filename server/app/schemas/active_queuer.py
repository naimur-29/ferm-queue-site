from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class ActiveQueuerCreate(BaseModel):
    user_id: UUID  = Field(..., description="user id (UUID)")
    
    artist_name: str = Field(..., min_length=1, max_length=100, description="artist name")
    
    track_title: str = Field(..., min_length=1, max_length=100, description="track_title")
    
    youtube_username: str = Field(..., min_length=1, max_length=100, description="youtube username")
    
    username: str = Field(..., min_length=1, max_length=100, description="username")
    
    link: str = Field(..., min_length=1, max_length=500, description="song link")
    
    message: Optional[str] = Field(..., max_length=200, description="message for streamer")
    
class ActiveQueuerUpdate(BaseModel):
    artist_name: Optional[str] = Field(..., min_length=1, max_length=100, description="artist name")
    
    track_title: Optional[str] = Field(..., min_length=1, max_length=100, description="track_title")
    
    youtube_username: Optional[str] = Field(..., min_length=1, max_length=100, description="youtube username")
    
    username: str = Field(..., min_length=1, max_length=100, description="username")
    
    link: Optional[str] = Field(..., min_length=1, max_length=500, description="song link")
    
    message: Optional[str] = Field(..., max_length=200, description="message for streamer")
    
class ActiveQueuerResponseAdmin(BaseModel):
    user_id: UUID
    artist_name: str
    track_title: str
    youtube_username: str
    link: str
    message: str
    created_at: datetime
    
class ActiveQueuerResponse(BaseModel):
    artist_name: str
    track_title: str
    youtube_username: str
    link: str
    message: str
    created_at: datetime
    
class ActiveQueuerResponsePersonal(BaseModel):
    user_id: UUID
    artist_name: str
    track_title: str
    youtube_username: str
    link: str
    message: str
    created_at: datetime