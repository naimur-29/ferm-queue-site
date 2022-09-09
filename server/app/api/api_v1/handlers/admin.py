from fastapi import APIRouter, HTTPException, status
import pymongo

from app.schemas.admin import AdminCreate
from app.services.admin import AdminService

admin_router = APIRouter()

@admin_router.post("/", summary="Add new admin to admin panel")
async def add_admin(data: AdminCreate):
    try:
        await AdminService.create_admin(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="admin already exist!"
        )