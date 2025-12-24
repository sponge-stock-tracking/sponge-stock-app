from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sponge_router, stock_router, user_router, report_router, notification_router, dashboard_router, chatbot_router
from app.core.database import Base, engine
from app.core.config import settings
import logging


app = FastAPI(title=settings.APP_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# Routers
app.include_router(user_router.router)
app.include_router(sponge_router.router)
app.include_router(stock_router.router)
app.include_router(report_router.router)
app.include_router(notification_router.router)
app.include_router(dashboard_router.router)
app.include_router(chatbot_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sponge Stock Management API!"}