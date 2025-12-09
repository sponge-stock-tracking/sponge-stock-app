# app/repositories/refresh_token_repository.py
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.refresh_tokens import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, *, jti: str, user_id: int, expires_at: datetime) -> RefreshToken:
        token = RefreshToken(
            jti=jti,
            user_id=user_id,
            expires_at=expires_at,
            revoked=False,
        )
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def get_by_jti(self, jti: str) -> RefreshToken | None:
        return (
            self.db.query(RefreshToken)
            .filter(RefreshToken.jti == jti)
            .first()
        )

    def revoke(self, jti: str) -> None:
        token = self.get_by_jti(jti)
        if not token:
            return
        token.revoked = True
        self.db.commit()

    def revoke_all_for_user(self, user_id: int) -> None:
        (
            self.db.query(RefreshToken)
            .filter(RefreshToken.user_id == user_id, RefreshToken.revoked == False)
            .update({"revoked": True})
        )
        self.db.commit()
