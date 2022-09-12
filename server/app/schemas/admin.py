from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class AdminCreate(BaseModel):
    email: EmailStr = Field(..., description="admin email")
    username: str = Field(..., min_length=1, max_length=50, description="admin username")
    password: str = Field(..., min_length=8, max_length=24, description="admin password")
    
class AdminReturn(BaseModel):
    email: EmailStr
    username: str
    created_at: datetime