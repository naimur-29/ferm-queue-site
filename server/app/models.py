from pydantic import BaseModel

class Member(BaseModel):
    serial: int
    username: str
    link: str
    
class Member_without_serial(BaseModel):
    username: str
    link: str