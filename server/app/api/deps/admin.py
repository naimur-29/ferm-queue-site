from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from datetime import datetime
from pydantic import ValidationError

from ...core.config import settings
from ...models.admin import Admin
from ...schemas.auth import TokenPayload
from ...services.admin import AdminService

reusable_oauth = OAuth2PasswordBearer(
    tokenUrl=f"{settings.api_v1_str}/auth/admin",
    scheme_name="JWT"
)

async def get_current_admin(token: str = Depends(reusable_oauth)) -> Admin:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.algorithm]
       ) 
        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired!",
                headers={"WWW-Authentication": "Bearer"}
            )
    except(jwt.JWTError, ValidationError):
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Could not validate token!",
                headers={"WWW-Authentication": "Bearer"}
            )
        
    res = await AdminService.get_admin_by_user_id(token_data.sub)
    
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found!"
        )

    return res