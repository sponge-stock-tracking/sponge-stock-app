import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from sqlalchemy.orm import sessionmaker

client = TestClient(app)

# Test database reset
@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def register_user(username="john", password="secret", role="operator"):
    return client.post("/users/register", json={
        "username": username,
        "email": f"{username}@test.com",
        "password": password,
        "role": role
    })


def login_user(username="john", password="secret"):
    return client.post(
        "/users/login",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )


def test_register_and_login():
    res = register_user()
    assert res.status_code == 201

    login = login_user()
    assert login.status_code == 200
    tokens = login.json()

    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert tokens["token_type"] == "bearer"


def test_wrong_password():
    register_user()

    res = login_user(password="WRONG")
    assert res.status_code == 401


def test_me_after_login():
    register_user()
    login = login_user()
    token = login.json()["access_token"]

    res = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200

    data = res.json()
    assert data["username"] == "john"
    assert data["email"] == "john@test.com"


def test_refresh_token_flow():
    register_user()
    login = login_user()

    refresh_token = login.json()["refresh_token"]

    # Refresh endpoint
    res = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert res.status_code == 200

    new_tokens = res.json()
    assert "access_token" in new_tokens
    assert "refresh_token" in new_tokens
    assert new_tokens["refresh_token"] != refresh_token  # rotation!


def test_refresh_token_cannot_be_used_twice():
    register_user()
    login = login_user()

    refresh_token = login.json()["refresh_token"]

    # İlk kullanım OK
    first = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert first.status_code == 200

    # İkinci kullanım REVOKED olmalı
    second = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert second.status_code == 401


def test_logout_revokes_refresh_tokens():
    register_user()
    login = login_user()
    refresh_token = login.json()["refresh_token"]
    access_token = login.json()["access_token"]

    # logout
    res = client.post("/users/logout", headers={"Authorization": f"Bearer {access_token}"})
    assert res.status_code == 204

    # refresh artık kullanılamaz olmalı
    res2 = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert res2.status_code == 401
