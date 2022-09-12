from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class QueuerCreate(BaseModel):
    artist_name: str = Field(..., min_length=1, max_length=100, description="artist name")
    track_title: str = Field(..., min_length=1, max_length=100, description="track_title")
    youtube_username: str = Field(..., min_length=1, max_length=100, description="youtube username")
    link: str = Field(..., min_length=1, max_length=500, description="song link")
    message: Optional[str] = Field(..., max_length=200, description="message for streamer")
    
class QueuerUpdate(BaseModel):
    artist_name: Optional[str] = Field(..., min_length=1, max_length=100, description="artist name")
    track_title: Optional[str] = Field(..., min_length=1, max_length=100, description="track_title")
    youtube_username: Optional[str] = Field(..., min_length=1, max_length=100, description="youtube username")
    link: Optional[str] = Field(..., min_length=1, max_length=500, description="song link")
    message: Optional[str] = Field(..., max_length=200, description="message for streamer")
    on_hold: Optional[bool]
    
class QueuerResponseAdmin(BaseModel):
    user_id: UUID
    artist_name: str
    track_title: str
    youtube_username: str
    link: str
    message: str
    on_hold: bool
    created_at: datetime
    
class QueuerResponse(BaseModel):
    artist_name: str
    track_title: str
    youtube_username: str
    link: str
    created_at: datetime
    
class QueuerResponsePersonal(BaseModel):
    user_id: UUID
    artist_name: str
    track_title: str
    youtube_username: str
    link: str
    message: str
    on_hold: bool
    created_at: datetime