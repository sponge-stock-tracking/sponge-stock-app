from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.stock_service import StockService
from app.services.report_service import ReportService
from app.utils.auth import get_current_user
import logging

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])
logger = logging.getLogger(__name__)

@router.get("/context")
def get_chatbot_context(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    """
    Aggregates all necessary context data for the chatbot in a single request.
    """
    try:
        # Initialize services
        stock_service = StockService(db)
        report_service = ReportService(db)

        # 1. Get Stock Summary
        stock_summary = stock_service.get_summary()
        
        # 2. Get Critical Stocks
        # report_service.critical() might return a dict {"message": ...} if empty
        critical_data = report_service.critical(notify=False)
        critical_stocks = []
        if isinstance(critical_data, list):
            critical_stocks = critical_data
        
        # 3. Get Recent Activity (Bonus: reusing weekly report or just raw logs?)
        # For now, let's use the weekly report logic as a proxy for "recent activity"
        # or we could add a method to StockService to get last N movements.
        # Let's keep it simple and use weekly report's top items as "recent highlights"
        weekly_report = report_service.weekly()
        recent_activity = weekly_report if "message" not in weekly_report else {}

        return {
            "stockSummary": stock_summary,
            "criticalStocks": critical_stocks,
            "recentActivity": recent_activity
        }
    except Exception as e:
        logger.error(f"Error generating chatbot context: {e}")
        return {
            "stockSummary": {},
            "criticalStocks": [],
            "recentActivity": {},
            "error": str(e)
        }
