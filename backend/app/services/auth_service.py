from datetime import timedelta
from fastapi import HTTPException, status
from app.repositories.user_repository import UserRepository
from app.utils.auth import verify_password, create_access_token
from app.schemas.users_schema import UserCreate, Token

class AuthService:
    def __init__(self, db):
        self.repo = UserRepository(db)

    def register_user(self, user: UserCreate):
        existing = self.repo.get_by_username(user.username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already registered")
        return self.repo.create(user)

    def authenticate_user(self, username: str, password: str):
        user = self.repo.get_by_username(username)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        access_token_expires = timedelta(minutes=60)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role.value},
            expires_delta=access_token_expires
        )
        return Token(access_token=access_token)
