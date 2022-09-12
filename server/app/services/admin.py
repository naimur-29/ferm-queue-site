from app.schemas.admin import AdminCreate
from app.models.admin import Admin
from app.core.security import get_password, verify_password
from datetime import datetime
from typing import Optional

class AdminService:
    @staticmethod
    async def create_admin(admin: AdminCreate):
        admin_in = Admin(
            username=admin.username,
            email=admin.email,
            hashed_password=get_password(admin.password),
            created_at=str(datetime.utcnow())
        )
        await admin_in.save()
        return admin_in
    
    @staticmethod
    async def authenticate(username_or_email: str, password: str) -> Optional[Admin]:
        res = await AdminService.get_admin_by_username(username=username_or_email)
        if not res:
            res = await AdminService.get_admin_by_email(email=username_or_email)
        
        if not res:
            return None
        if not verify_password(password=password, hashed_pass=res.hashed_password):
            return None
        return res
    
    @staticmethod
    async def get_admin_by_email(email: str) -> Optional[Admin]:
        res = await Admin.find_one(Admin.email == email)
        return res
    
    @staticmethod
    async def get_admin_by_username(username: str) -> Optional[Admin]:
        res = await Admin.find_one(Admin.username == username)
        return res