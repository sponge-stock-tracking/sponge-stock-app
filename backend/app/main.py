from fastapi import FastAPI
from app.core.database import Base, engine
from app.routers import sponge_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sponge Stock Backend", version="1.0.0")

app.include_router(sponge_router.router, prefix="/sponges", tags=["Sponge API"])

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
