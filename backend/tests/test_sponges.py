import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from sqlalchemy.orm import sessionmaker

# Test DB setup
engine_test = engine
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture
def client():
    Base.metadata.drop_all(bind=engine_test)
    Base.metadata.create_all(bind=engine_test)

    with TestClient(app) as c:
        yield c


def test_create_sponge(client):
    payload = {
        "name": "Soft Foam",
        "density": 30.5,
        "hardness": "medium",
        "unit": "m3",
        "width": 100,
        "height": 200,
        "thickness": 10,
        "critical_stock": 5
    }

    res = client.post("/sponges/", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert data["name"] == "Soft Foam"
    assert data["density"] == 30.5
    assert data["critical_stock"] == 5
    assert "id" in data


def test_list_sponges(client):
    # Add sponge
    client.post(
        "/sponges/",
        json={
            "name": "Foam A",
            "density": 20,
            "hardness": "soft",
            "unit": "m3",
        },
    )

    res = client.get("/sponges/")
    assert res.status_code == 200
    data = res.json()

    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Foam A"


def test_get_sponge(client):
    create_res = client.post(
        "/sponges/",
        json={
            "name": "BlockX",
            "density": 40,
            "hardness": "hard",
            "unit": "m3",
        },
    )
    sponge_id = create_res.json()["id"]

    res = client.get(f"/sponges/{sponge_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "BlockX"


def test_update_sponge(client):
    create_res = client.post(
        "/sponges/",
        json={
            "name": "UpdateMe",
            "density": 10,
            "hardness": "soft",
            "unit": "m3",
        },
    )
    sponge_id = create_res.json()["id"]

    update_payload = {
        "name": "Updated",
        "density": 12,
        "hardness": "medium",
        "unit": "m3"
    }

    res = client.put(f"/sponges/{sponge_id}", json=update_payload)
    assert res.status_code == 200
    assert res.json()["name"] == "Updated"


def test_delete_sponge(client):
    create_res = client.post(
        "/sponges/",
        json={
            "name": "DeleteMe",
            "density": 55,
            "hardness": "hard",
            "unit": "m3",
        },
    )

    sponge_id = create_res.json()["id"]

    del_res = client.delete(f"/sponges/{sponge_id}")
    assert del_res.status_code == 204   

    # Check it’s gone
    get_res = client.get(f"/sponges/{sponge_id}")
    assert get_res.status_code == 404


def test_duplicate_name_should_fail(client):
    payload = {
        "name": "UniqueFoam",
        "density": 22,
        "hardness": "soft",
        "unit": "m3",
    }

    client.post("/sponges/", json=payload)
    res = client.post("/sponges/", json=payload)

    # Currently backend duplicate kontrolü yapmıyor.
    # Bu test FAIL edecektir — ve biz bunu FIX edeceğiz.
    #
    # Şimdilik expected:
    assert res.status_code in (400, 409, 500)
