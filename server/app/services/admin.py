from app.schemas.admin import AdminCreate
from app.models.admin import Admin
from app.core.security import get_password

class AdminService:
    @staticmethod
    async def create_admin(admin: AdminCreate):
        admin_in = Admin(
            username=admin.username,
            email=admin.email,
            hashed_password=get_password(admin.password),
            first_name=admin.first_name,
            last_name=admin.last_name
        )
        await admin_in.save()
        return admin_in