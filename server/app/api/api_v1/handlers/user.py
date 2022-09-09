from fastapi import APIRouter

from app.schemas.user import UserCreate

user_router = APIRouter()

@user_router.post("/", summary="Add new user to queue")
async def add_admin(data: UserCreate):
    pass