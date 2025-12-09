from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.auth_service import AuthService
from app.schemas.users_schema import UserCreate, UserResponse, Token
from app.utils.auth import get_current_user

from pydantic import BaseModel


class RefreshTokenRequest(BaseModel):
    refresh_token: str


router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return AuthService(db).register_user(user)


@router.post("/login", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    OAuth2 standardına uygun login endpoint’i.
    Body:
      grant_type=&username=...&password=...&scope=&client_id=&client_secret=
    """
    return AuthService(db).authenticate_user(form_data.username, form_data.password)


@router.post("/refresh", response_model=Token)
def refresh_token(body: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Body:
    {
      "refresh_token": "xxx"
    }
    """
    return AuthService(db).refresh(body.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Kullanıcının tüm refresh tokenlarını revoke eder.
    Access token zaten kısa ömürlü olduğu için black-list tutmuyoruz.
    """
    AuthService(db).logout(current_user.id)
    return


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user=Depends(get_current_user)):
    return current_user
