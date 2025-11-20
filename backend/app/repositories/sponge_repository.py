# app/repositories/sponge_repository.py
from sqlalchemy.orm import Session
from app.models.sponge import Sponge
from app.schemas.sponge_schema import SpongeCreate

def get_all(db: Session):
    return db.query(Sponge).all()

def create(db: Session, sponge: SpongeCreate):
    db_sponge = Sponge(**sponge.dict())
    db.add(db_sponge)
    db.commit()
    db.refresh(db_sponge)
    return db_sponge

def get_by_id(db: Session, sponge_id: int):
    return db.query(Sponge).filter(Sponge.id == sponge_id).first()  
def delete(db: Session, sponge_id: int):
    db_sponge = db.query(Sponge).filter(Sponge.id == sponge_id).first()
    if db_sponge:
        db.delete(db_sponge)
        db.commit()
    return db_sponge
def update(db: Session, sponge_id: int, sponge: SpongeCreate):  
    db_sponge = db.query(Sponge).filter(Sponge.id == sponge_id).first()
    if db_sponge:
        for key, value in sponge.dict().items():
            setattr(db_sponge, key, value)
        db.commit()
        db.refresh(db_sponge)
    return db_sponge