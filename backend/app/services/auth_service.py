from datetime import timedelta, datetime, timezone
from fastapi import HTTPException, status

from app.repositories.user_repository import UserRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.utils.auth import verify_password, create_access_token, create_refresh_token
from app.schemas.users_schema import UserCreate, Token
from app.core.config import settings


class AuthService:
    def __init__(self, db):
        self.db = db
        self.user_repo = UserRepository(db)
        self.refresh_repo = RefreshTokenRepository(db)

    def register_user(self, user: UserCreate):
        existing = self.user_repo.get_by_username(user.username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already registered")

        existing_email = self.user_repo.get_by_email(user.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

        return self.user_repo.create(user)

    def authenticate_user(self, username: str, password: str) -> Token:
        user = self.user_repo.get_by_username(username)
        if not user or not verify_password(password, user.password_hash):
            # Buraya rate-limiting hook'u ekleyebilirsin (Redis vs.)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        # last_login güncelle
        user.last_login = datetime.now(timezone.utc)
        self.user_repo.save(user)

        # Access token
        access_token, exp = create_access_token(subject=user.username, role=user.role)

        # Refresh token
        refresh_token, jti, refresh_exp = create_refresh_token(
            subject=user.username,
            role=user.role,
        )

        # Refresh token db'ye yaz
        self.refresh_repo.create(
            jti=jti,
            user_id=user.id,
            expires_at=refresh_exp,
        )

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    def logout(self, user_id: int):
        # Kullanıcının tüm refresh tokenlarını revoke et
        self.refresh_repo.revoke_all_for_user(user_id)

    def refresh(self, refresh_token: str) -> Token:
        from app.utils.auth import decode_token_raw, create_access_token, create_refresh_token

        payload = decode_token_raw(refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=400, detail="Invalid refresh token")

        username = payload.get("sub")
        jti = payload.get("jti")
        role = payload.get("role")

        if not username or not jti:
            raise HTTPException(status_code=400, detail="Invalid refresh token payload")

        # DB'de refresh token kayıtlı mı, revoked mı?
        token_row = self.refresh_repo.get_by_jti(jti)
        if not token_row or token_row.revoked:
            raise HTTPException(status_code=401, detail="Refresh token is revoked or not found")

        if token_row.expires_at < datetime.now(timezone.utc):
            self.refresh_repo.revoke(jti)
            raise HTTPException(status_code=401, detail="Refresh token expired")

        user = self.user_repo.get_by_username(username)
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")

        # Eski refresh token'ı revoke et (rotation)
        self.refresh_repo.revoke(jti)

        # Yeni access & refresh üret
        access_token, exp = create_access_token(subject=user.username, role=user.role)
        new_refresh_token, new_jti, new_refresh_exp = create_refresh_token(
            subject=user.username,
            role=user.role,
        )
        self.refresh_repo.create(
            jti=new_jti,
            user_id=user.id,
            expires_at=new_refresh_exp,
        )

        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )
