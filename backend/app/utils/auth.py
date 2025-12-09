# app/utils/auth.py

from datetime import datetime, timedelta, timezone
import uuid
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError, JWTClaimsError 
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.database import get_db
from app.core.config import settings
from app.models.users import User
from app.schemas.users_schema import TokenData, UserRole


# =========================
# CONFIG
# =========================

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
REFRESH_TOKEN_EXPIRE_DAYS = 7   # Refresh token ömrü (testler 7 günü kabul ediyor)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)


# =========================
# PASSWORD HELPERS
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# INTERNAL PAYLOAD BUILDER
# =========================

def _build_token_payload(*, subject: str, role: UserRole, token_type: str, expires_delta: timedelta):
    now = datetime.now(timezone.utc)
    expire = now + expires_delta
    jti = str(uuid.uuid4())

    payload = {
        "sub": subject,
        "role": role.value if isinstance(role, UserRole) else str(role),
        "type": token_type,
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": "sponge-stock-api",
    }
    return payload, jti, expire


# =========================
# ACCESS TOKEN
# =========================


def create_access_token(subject: str, role: UserRole):
    expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    
    payload, _, expire = _build_token_payload(
        subject=subject,
        role=role,
        token_type="access",
        expires_delta=timedelta(minutes=expire_minutes),
    )
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, expire

# =========================
# REFRESH TOKEN
# =========================

def create_refresh_token(subject: str, role: UserRole):
    expire_days = settings.REFRESH_TOKEN_EXPIRE_DAYS
    payload, jti, expire = _build_token_payload(
        subject=subject,
        role=role,
        token_type="refresh",
        expires_delta=timedelta(days=expire_days),
    )
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expire


# =========================
# DECODE HELPERS
# =========================

def decode_token_raw(token: str) -> dict:
    """
    Ham payload döner. Test runner'ın jose sürümlerinde exp bazen datetime
    dönebiliyor, bunu normalize ediyoruz.
    """
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_aud": False},
        )
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTClaimsError:
        raise HTTPException(status_code=401, detail="Invalid token claims")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Normalize exp → timestamp (int)
    exp = payload.get("exp")
    if isinstance(exp, datetime):
        payload["exp"] = int(exp.timestamp())

    return payload


def decode_token_subject(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None


# =========================
# AUTH MODELS
# =========================

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode token properly
    payload = decode_token_raw(token)

    # Access token türü doğrulanmalı
    if payload.get("type") != "access":
        raise credentials_error

    username = payload.get("sub")
    role_value = payload.get("role")
    jti = payload.get("jti")

    if not username or not jti:
        raise credentials_error

    # Role parse
    try:
        role = UserRole(role_value)
    except Exception:
        raise credentials_error

    # Kullanıcı al
    user = db.query(User).filter(User.username == username).first()
    if not user or not user.is_active:
        raise credentials_error

    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user
