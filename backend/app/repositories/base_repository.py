from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

class BaseRepository:
    def __init__(self, db: Session, model):
        self.db = db
        self.model = model

    def get_all(self):
        return self.db.query(self.model).all()

    def get_by_id(self, obj_id: int):
        return self.db.query(self.model).filter(self.model.id == obj_id).first()

    def create(self, obj_data: dict):
        try:
            obj = self.model(**obj_data)
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except IntegrityError:
            self.db.rollback()
            raise ValueError(f"{self.model.__name__} zaten mevcut veya veri bütünlüğü hatası oluştu.")

    def delete(self, obj_id: int):
        obj = self.get_by_id(obj_id)
        if not obj:
            return None
        self.db.delete(obj)
        self.db.commit()
        return obj
