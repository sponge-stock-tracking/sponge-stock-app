import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    """
    Her testten önce/veri sonra:
    - Tüm tabloları drop + create
    Böylece testler birbirini kirletmez.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def create_sponge(name="ReportFoam", critical_stock=10):
    res = client.post(
        "/sponges/",
        json={
            "name": name,
            "density": 25,
            "hardness": "medium",
            "unit": "m3",
            "critical_stock": critical_stock,
        },
    )
    assert res.status_code == 201
    return res.json()["id"]


def create_stock(sponge_id: int, type_: str, quantity: float):
    res = client.post(
        "/stocks/",
        json={
            "sponge_id": sponge_id,
            "type": type_,
            "quantity": quantity,
        },
    )
    assert res.status_code == 201
    return res.json()


# ---------------------------
# WEEKLY REPORT TESTLERİ
# ---------------------------

def test_weekly_report_no_data():
    """
    Hiç stok hareketi yoksa
    weekly endpoint 'message' döndürmeli.
    """
    res = client.get("/reports/weekly")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert data["message"] == "Son 7 gün içinde hareket bulunamadı."


def test_weekly_report_with_data():
    """
    Basit bir senaryoda:
    - 1 sünger
    - 50 in, 20 out
    Beklenen:
    - total_in = 50
    - total_out = 20
    - top_items listesinde o sünger görünmeli
    """
    sponge_id = create_sponge(name="WeeklyFoam")

    create_stock(sponge_id, "in", 50)
    create_stock(sponge_id, "out", 20)

    res = client.get("/reports/weekly")
    assert res.status_code == 200
    data = res.json()

    assert "period" in data
    assert data["total_in"] == 50
    assert data["total_out"] == 20
    assert isinstance(data["top_items"], list)
    assert len(data["top_items"]) == 1
    assert data["top_items"][0]["name"] == "WeeklyFoam"
    assert data["top_items"][0]["net"] == 30  # 50 - 20


# ---------------------------
# MONTHLY REPORT TESTLERİ
# ---------------------------

def test_monthly_report_no_data():
    """
    Hiç hareket yoksa aylık rapor endpoint'i
    'Bu ay içinde hareket bulunamadı.' dönmeli.
    """
    res = client.get("/reports/monthly")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert data["message"] == "Bu ay içinde hareket bulunamadı."


def test_monthly_report_with_data():
    """
    İçinde bulunulan ayda yapılan giriş/çıkışların
    doğru toplandığını test eder.
    """
    sponge_id = create_sponge(name="MonthlyFoam")

    create_stock(sponge_id, "in", 100)
    create_stock(sponge_id, "out", 40)

    res = client.get("/reports/monthly")
    assert res.status_code == 200
    data = res.json()

    assert "month" in data
    assert data["total_in"] == 100
    assert data["total_out"] == 40
    assert isinstance(data["items"], list)
    assert len(data["items"]) == 1

    item = data["items"][0]
    assert item["name"] == "MonthlyFoam"
    assert item["in"] == 100
    assert item["out"] == 40


# ---------------------------
# CRITICAL STOCK REPORT TESTLERİ
# ---------------------------

def test_critical_report_no_data():
    """
    Hiç ürün yokken critical endpoint
    'Kritik stokta ürün bulunmuyor.' mesajı vermeli.
    """
    res = client.get("/reports/critical")
    assert res.status_code == 200
    data = res.json()
    assert "message" in data
    assert data["message"] == "Kritik stokta ürün bulunmuyor."


def test_critical_report_with_critical_item():
    """
    Stok seviyesi critical_stock'un altında olan
    ürünün critical listesine düştüğünü test eder.
    """
    # critical_stock = 50, mevcut stok 10 => kritik olmalı
    sponge_id = create_sponge(name="CriticalFoam", critical_stock=50)

    create_stock(sponge_id, "in", 10)

    res = client.get("/reports/critical")
    assert res.status_code == 200
    data = res.json()

    # Bu durumda liste dönüyor
    assert isinstance(data, list)
    assert len(data) == 1

    item = data[0]
    assert item["name"] == "CriticalFoam"
    assert item["status"] == "critical"
    assert item["available_stock"] == 10.0
    assert item["critical_stock"] == 50.0
    assert item["available_stock"] < item["critical_stock"]
