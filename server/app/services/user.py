from app.schemas.user import UserCreate
from app.models.user import User

class UserService:
    @staticmethod
    async def create_user(user: UserCreate):
        user_in = User(
            username=user.username,
            link=user.link,
            message=user.message
        )