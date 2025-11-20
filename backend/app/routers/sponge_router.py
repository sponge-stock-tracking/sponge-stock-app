# app/routers/sponge_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.sponge_schema import SpongeCreate, SpongeResponse
from app.repositories import sponge_repository

router = APIRouter()

@router.get("/", response_model=list[SpongeResponse])
def list_sponges(db: Session = Depends(get_db)):
    return sponge_repository.get_all(db)

@router.post("/", response_model=SpongeResponse)
def create_sponge(sponge: SpongeCreate, db: Session = Depends(get_db)):
    return sponge_repository.create(db, sponge)
