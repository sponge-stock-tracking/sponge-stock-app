from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.users_schema import UserCreate
from app.utils.auth import hash_password


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> User | None:
        return self.db.query(User).filter(User.username == username).first()

    def get_by_email(self, email: str | None) -> User | None:
        if not email:
            return None
        return self.db.query(User).filter(User.email == email).first()

    def create(self, user: UserCreate) -> User:
        # bcrypt güvenliği için 72 char sınırı
        plain_pw = str(user.password)[:72]
        hashed_pw = hash_password(plain_pw)
        db_user = User(
            username=user.username,
            email=user.email,
            password_hash=hashed_pw,
            role=user.role,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def save(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
