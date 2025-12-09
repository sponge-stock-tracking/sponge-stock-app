from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case, cast, Float # <--- case IMPORT ETTİK
from datetime import datetime, timedelta
from app.models.stocks import Stock, StockType
from app.models.sponges import Sponge

class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_weekly_summary(self):
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        result = (
            self.db.query(
                Sponge.name,
                func.coalesce(func.sum(case(
                    (Stock.type.in_([StockType.in_, StockType.return_]), Stock.quantity),
                    else_=0
                )), 0).label("total_in"),
                func.coalesce(func.sum(case(
                    (Stock.type == StockType.out, Stock.quantity),
                    else_=0
                )), 0).label("total_out")
            )
            .join(Sponge, Sponge.id == Stock.sponge_id)
            .filter(Stock.date >= one_week_ago)
            .group_by(Sponge.name)
            .all()
        )
        return result

    def get_monthly_summary(self):
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        result = (
            self.db.query(
                Sponge.name,
                func.coalesce(func.sum(case(
                    (Stock.type.in_([StockType.in_, StockType.return_]), Stock.quantity),
                    else_=0
                )), 0).label("total_in"),
                func.coalesce(func.sum(case(
                    (Stock.type == StockType.out, Stock.quantity),
                    else_=0
                )), 0).label("total_out")
            )
            .join(Sponge, Sponge.id == Stock.sponge_id)
            .filter(extract("month", Stock.date) == current_month)
            .filter(extract("year", Stock.date) == current_year)
            .group_by(Sponge.name)
            .all()
        )
        return result

    def get_critical_stocks(self):
        # Having clause içinde aggregate fonksiyonu kullanımı
        # Stok miktarı: (Girenler + İadeler) - Çıkanlar
        
        # Giriş/İade ise +, Çıkış ise - quantity
        balance_expr = case(
            (Stock.type.in_([StockType.in_, StockType.return_]), Stock.quantity),
            else_=-Stock.quantity
        )

        result = (
            self.db.query(
                Sponge.name,
                func.coalesce(func.sum(balance_expr), 0).label("available_stock"),
                Sponge.critical_stock
            )
            .join(Sponge, Sponge.id == Stock.sponge_id)
            .group_by(Sponge.id, Sponge.name, Sponge.critical_stock) # Group by alanları tam olmalı
            .having(func.coalesce(func.sum(balance_expr), 0) <= Sponge.critical_stock)
            .all()
        )
        return result