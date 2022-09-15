from fastapi import APIRouter, HTTPException, status, Depends
import pymongo

from ....schemas.admin import AdminCreate
from ....services.admin import AdminService
from ....api.auth.jwt import get_current_admin
from ....models.admin import Admin
from ....core.config import settings

admin_router = APIRouter()

@admin_router.post("/", summary="Add new admin to admin panel")
async def add_admin(data: AdminCreate, admin: Admin = Depends(get_current_admin)):
    if admin.username == settings.admin or admin.active:
        try:
            await AdminService.create_admin(data)
            return {"message": "Admin Created Successfully!"}
        except pymongo.errors.DuplicateKeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Admin Already Exists!"
            )
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized to perform such task!")
    