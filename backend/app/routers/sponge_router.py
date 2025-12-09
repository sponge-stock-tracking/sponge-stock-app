from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging
from app.core.database import get_db
from app.schemas.sponge_schema import SpongeCreate, SpongeRead
from app.services.sponge_service import SpongeService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sponges", tags=["Sponges"])


@router.get("/", response_model=list[SpongeRead], status_code=status.HTTP_200_OK)
def list_sponges(db: Session = Depends(get_db)):
    sponges = SpongeService(db).get_all()
    logger.info("Sponges listed.")
    return sponges


@router.get("/{sponge_id}", response_model=SpongeRead, status_code=status.HTTP_200_OK)
def get_sponge(sponge_id: int, db: Session = Depends(get_db)):
    sponge = SpongeService(db).get_by_id(sponge_id)
    if not sponge:
        raise HTTPException(status_code=404, detail="Sponge not found")
    return sponge


@router.post("/", response_model=SpongeRead, status_code=status.HTTP_201_CREATED)
def create_sponge(sponge: SpongeCreate, db: Session = Depends(get_db)):
    created = SpongeService(db).create(sponge)
    logger.info(f"Sponge created: {created.name}")
    return created


@router.put("/{sponge_id}", response_model=SpongeRead, status_code=status.HTTP_200_OK)
def update_sponge(sponge_id: int, sponge: SpongeCreate, db: Session = Depends(get_db)):
    updated = SpongeService(db).update(sponge_id, sponge)
    logger.info(f"Sponge updated: {updated.id}")
    return updated


@router.delete("/{sponge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sponge(sponge_id: int, db: Session = Depends(get_db)):
    SpongeService(db).delete(sponge_id)
    logger.info(f"Sponge deleted: {sponge_id}")
    return {"message": "Sponge deleted successfully"}
