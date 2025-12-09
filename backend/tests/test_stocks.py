import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from sqlalchemy.orm import sessionmaker

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def create_sponge(name="TestFoam", critical=5):
    res = client.post("/sponges/", json={
        "name": name,
        "density": 25,
        "hardness": "medium",
        "unit": "m3",
        "critical_stock": critical,
    })
    return res.json()["id"]


def test_stock_increase():
    sponge_id = create_sponge()

    res = client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "in",
        "quantity": 50
    })

    assert res.status_code == 201
    data = res.json()
    assert data["quantity"] == 50


def test_stock_out_decrease():
    sponge_id = create_sponge()

    client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "in",
        "quantity": 30
    })

    res = client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "out",
        "quantity": 10
    })

    assert res.status_code == 201

    final_stock = client.get(f"/stocks/{sponge_id}/total").json()["total"]
    assert final_stock == 20


def test_stock_out_more_than_available_should_fail():
    sponge_id = create_sponge()

    client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "in",
        "quantity": 20
    })

    res = client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "out",
        "quantity": 50
    })

    assert res.status_code == 400
    assert "Not enough stock" in res.json()["detail"]


def test_stock_create_invalid_sponge():
    res = client.post("/stocks/", json={
        "sponge_id": 9999,
        "type": "in",
        "quantity": 10
    })

    assert res.status_code == 404


def test_critical_stock_warning():
    sponge_id = create_sponge(critical=10)

    client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "in",
        "quantity": 15
    })

    client.post("/stocks/", json={
        "sponge_id": sponge_id,
        "type": "out",
        "quantity": 10
    })

    res = client.get(f"/stocks/{sponge_id}/status")
    assert res.status_code == 200
    assert res.json()["critical"] is True
