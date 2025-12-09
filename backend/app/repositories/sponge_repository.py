from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.sponges import Sponge
from app.schemas.sponge_schema import SpongeCreate

class SpongeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(Sponge).all()

    def get_by_id(self, sponge_id: int):
        return self.db.query(Sponge).filter(Sponge.id == sponge_id).first()

    def get_by_name(self, name: str):
        return self.db.query(Sponge).filter(Sponge.name == name).first()

    def create(self, sponge: SpongeCreate):
        try:
            obj = Sponge(**sponge.model_dump())
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Bu sünger zaten kayıtlı veya veri hatalı.")

    def update(self, sponge_id: int, sponge: SpongeCreate):
        obj = self.get_by_id(sponge_id)
        if not obj:
            return None

        for key, value in sponge.model_dump().items():
            if value is not None:
                setattr(obj, key, value)

        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, sponge_id: int):
        obj = self.get_by_id(sponge_id)
        if not obj:
            return None

        self.db.delete(obj)
        self.db.commit()
        return obj
