from datetime import datetime, timedelta, timezone
import uuid
import logging
from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.database import get_db
from app.core.config import settings
from app.models.users import User
from app.schemas.users_schema import TokenData, UserRole

# Logger
logger = logging.getLogger(__name__)

# =========================
# CONFIG
# =========================

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
# DİKKAT: ACCESS_TOKEN_EXPIRE_MINUTES buradan silindi, fonksiyon içinde okunacak.
REFRESH_TOKEN_EXPIRE_DAYS = 7 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
    bcrypt__truncate_error=True,
)

# ... (Password Helpers aynı kalsın) ...
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ... (Internal Payload Builder aynı kalsın) ...
def _build_token_payload(*, subject: str, role: UserRole, token_type: str, expires_delta: timedelta):
    now = datetime.now(timezone.utc)
    expire = now + expires_delta
    jti = str(uuid.uuid4())
    
    # DÜZELTME: role'ü her zaman .value olarak al
    role_str = role.value if isinstance(role, UserRole) else role
    
    payload = {
        "sub": subject,
        "role": role_str,
        "type": token_type,
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": "sponge-stock-api",
    }
    return payload, jti, expire

# =========================
# ACCESS TOKEN (DÜZELTİLDİ)
# =========================

def create_access_token(subject: str, role: UserRole):
    # DÜZELTME: Ayarı her seferinde canlı oku (Testlerde patch çalışması için)
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
    # Refresh token süresi genelde sabittir ama isterseniz bunu da config'den alabilirsiniz
    expire_days = REFRESH_TOKEN_EXPIRE_DAYS 
    
    payload, jti, expire = _build_token_payload(
        subject=subject,
        role=role,
        token_type="refresh",
        expires_delta=timedelta(days=expire_days),
    )
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expire

# ... (Geri kalan decode_token_raw, get_current_user vb. aynı kalabilir) ...
def decode_token_raw(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_aud": False},
        )
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    exp = payload.get("exp")
    if isinstance(exp, datetime):
        payload["exp"] = int(exp.timestamp())

    return payload

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.info(f"🔍 Token validation started. Token length: {len(token) if token else 0}")
    
    try:
        payload = decode_token_raw(token)
        logger.info(f"✅ Token decoded successfully. Payload: {payload}")
    except HTTPException as e:
        logger.error(f"❌ Token decode failed: {e.detail}")
        raise
    
    token_type = payload.get("type")
    if token_type != "access":
        logger.error(f"❌ Invalid token type: {token_type} (expected: access)")
        raise credentials_error
    
    username = payload.get("sub")
    role_value = payload.get("role")
    jti = payload.get("jti")
    
    logger.info(f"📋 Token data: username={username}, role={role_value}, jti={jti}")
    
    if not username or not jti:
        logger.error(f"❌ Missing required fields: username={username}, jti={jti}")
        raise credentials_error
    
    try:
        role = UserRole(role_value)
        logger.info(f"✅ Role validated: {role}")
    except Exception as e:
        logger.error(f"❌ Invalid role value: {role_value}, error: {e}")
        raise credentials_error
    
    user = db.query(User).filter(User.username == username).first()
    if not user:
        logger.error(f"❌ User not found: {username}")
        raise credentials_error
    
    if not user.is_active:
        logger.error(f"❌ User inactive: {username}")
        raise credentials_error
    
    logger.info(f"✅ User authenticated successfully: {username} (id={user.id}, role={user.role})")
    return user

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user