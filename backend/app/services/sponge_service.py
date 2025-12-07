import logging
from fastapi import HTTPException
from app.repositories.sponge_repository import SpongeRepository
from app.schemas.sponge_schema import SpongeCreate

logger = logging.getLogger(__name__)

class SpongeService:
    def __init__(self, db):
        self.repo = SpongeRepository(db)

    def get_all(self):
        sponges = self.repo.get_all()
        if not sponges:
            logger.info("Veritabanında kayıtlı sünger bulunamadı.")
        return sponges

    def get_by_id(self, sponge_id: int):
        sponge = self.repo.get_by_id(sponge_id)
        if not sponge:
            raise HTTPException(status_code=404, detail="Sünger bulunamadı.")
        return sponge

    def create(self, sponge: SpongeCreate):
        try:
            return self.repo.create(sponge)
        except ValueError as e:
            logger.error(f"Sünger oluşturulamadı: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    def update(self, sponge_id: int, sponge: SpongeCreate):
        obj = self.repo.get_by_id(sponge_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Sünger bulunamadı.")
        return self.repo.update(sponge_id, sponge)

    def delete(self, sponge_id: int):
        obj = self.repo.delete(sponge_id)
        if not obj:
            raise HTTPException(status_code=404, detail="Sünger silinemedi (bulunamadı).")
        return obj
