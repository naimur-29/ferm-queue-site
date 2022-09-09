from pydantic import BaseModel, Field, EmailStr

class AdminCreate(BaseModel):
    email: EmailStr = Field(..., description="admin email")
    username: str = Field(..., min_length=5, max_length=50, description="admin username")
    password: str = Field(..., min_length=5, max_length=24, description="admin password")
    first_name: str = Field(..., min_length=1, max_length=50, description="admin first name")
    last_name: str = Field(..., min_length=1, max_length=50, description="admin last name")
    