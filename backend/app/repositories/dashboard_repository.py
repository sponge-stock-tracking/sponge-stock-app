from sqlalchemy.orm import Session
from sqlalchemy import func, case
from datetime import datetime, timedelta
from app.models.stocks import Stock, StockType
from app.models.sponges import Sponge

class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_overview_stats(self):
        """
        Dashboard için genel istatistikler
        - Toplam ürün sayısı
        - Toplam stok miktarı
        - Kritik stokta olan ürün sayısı
        - Son 24 saat içindeki hareket sayısı
        """
        # Toplam ürün sayısı
        total_products = self.db.query(func.count(Sponge.id)).scalar() or 0
        
        # Toplam stok ve kritik stok sayısı
        balance_expr = case(
            (Stock.type.in_([StockType.in_, StockType.return_]), Stock.quantity),
            else_=-Stock.quantity
        )
        
        stock_query = (
            self.db.query(
                Sponge.id,
                func.coalesce(func.sum(balance_expr), 0).label("current_stock"),
                Sponge.critical_stock
            )
            .outerjoin(Stock, Stock.sponge_id == Sponge.id)
            .group_by(Sponge.id, Sponge.critical_stock)
        ).all()
        
        total_stock = sum(row.current_stock for row in stock_query)
        critical_count = sum(1 for row in stock_query if row.current_stock <= row.critical_stock)
        
        # Son 24 saat içindeki hareket sayısı
        twenty_four_hours_ago = datetime.utcnow() - timedelta(hours=24)
        recent_movements = (
            self.db.query(func.count(Stock.id))
            .filter(Stock.date >= twenty_four_hours_ago)
            .scalar() or 0
        )
        
        return {
            "total_products": total_products,
            "total_stock": float(total_stock),
            "critical_stock_count": critical_count,
            "recent_movements_24h": recent_movements
        }
    
    def get_weekly_trend(self):
        """
        Son 7 günün günlük giriş/çıkış trendi
        """
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        daily_data = (
            self.db.query(
                func.date(Stock.date).label("date"),
                func.coalesce(func.sum(case(
                    (Stock.type.in_([StockType.in_, StockType.return_]), Stock.quantity),
                    else_=0
                )), 0).label("total_in"),
                func.coalesce(func.sum(case(
                    (Stock.type == StockType.out, Stock.quantity),
                    else_=0
                )), 0).label("total_out")
            )
            .filter(Stock.date >= seven_days_ago)
            .group_by(func.date(Stock.date))
            .order_by(func.date(Stock.date))
            .all()
        )
        
        return [
            {
                "date": str(row.date),
                "total_in": float(row.total_in),
                "total_out": float(row.total_out),
                "net": float(row.total_in - row.total_out)
            }
            for row in daily_data
        ]
    
    def get_top_movers(self, limit: int = 5):
        """
        Son 7 gündeki en çok hareket gören ürünler
        """
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        top_movers = (
            self.db.query(
                Sponge.name,
                func.count(Stock.id).label("movement_count"),
                func.coalesce(func.sum(Stock.quantity), 0).label("total_quantity")
            )
            .join(Stock, Stock.sponge_id == Sponge.id)
            .filter(Stock.date >= seven_days_ago)
            .group_by(Sponge.name)
            .order_by(func.count(Stock.id).desc())
            .limit(limit)
            .all()
        )
        
        return [
            {
                "name": row.name,
                "movement_count": row.movement_count,
                "total_quantity": float(row.total_quantity)
            }
            for row in top_movers
        ]
