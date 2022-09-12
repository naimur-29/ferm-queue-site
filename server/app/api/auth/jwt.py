from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from jose import jwt
from pydantic import ValidationError

from app.services import admin
from app.core.security import create_access_token, create_refresh_token
from app.schemas import auth, admin
from app.api.deps.admin import get_current_admin, reusable_oauth
from app.models.admin import Admin
from app.services.admin import AdminService
from app.core.config import settings


auth_router = APIRouter()

@auth_router.post("/", summary="Create access token & refresh token for admin authentication", response_model=auth.Token)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    res = await AdminService.authenticate(username_or_email=form_data.username, password=form_data.password)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect Email or Password!")
    
    return {
        "access_token": create_access_token(res.user_id),
        "refresh_token": create_refresh_token(res.user_id)
    }
    
@auth_router.post("/test-token", summary="Test if the access token is valid", response_model=admin.AdminReturn)
async def test_token(admin: Admin = Depends(get_current_admin)):
    return admin

@auth_router.post("/refresh", summary="Refresh the token", response_model=auth.Token)
async def refresh_token(token:str = Depends(reusable_oauth)):
    try:
        payload = jwt.decode(
            token, settings.jwt_refresh_secret_key, algorithms=[settings.algorithm]
       ) 
        token_data = auth.TokenPayload(**payload)
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
    
    return {
        "access_token": create_access_token(res.user_id),
        "refresh_token": create_refresh_token(res.user_id)
    }