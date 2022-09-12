from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

from app.services import admin
from app.core.security import create_access_token, create_refresh_token

auth_router = APIRouter()

@auth_router.post("/", summary="Admin authentication")
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    res = await admin.AdminService.authenticate(username_or_email=form_data.username, password=form_data.password)
    
    if not res:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect Email or Password!")
    
    return {
        "access_token": create_access_token(res.user_id),
        "refresh_token": create_refresh_token(res.user_id)
    }