import pytest


def register_user(client, username="john", password="secret", role="operator"):
    return client.post("/users/register", json={
        "username": username,
        "email": f"{username}@test.com",
        "password": password,
        "role": role
    })


def login_user(client, username="john", password="secret"):
    return client.post(
        "/users/login",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )


def test_register_and_login(client):
    res = register_user(client)
    assert res.status_code == 201

    login = login_user(client)
    assert login.status_code == 200
    tokens = login.json()

    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert tokens["token_type"] == "bearer"


def test_wrong_password(client):
    register_user(client)

    res = login_user(client, password="WRONG")
    assert res.status_code == 401


def test_me_after_login(client):
    register_user(client)
    login = login_user(client)
    token = login.json()["access_token"]

    res = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200

    data = res.json()
    assert data["username"] == "john"
    assert data["email"] == "john@test.com"


def test_refresh_token_flow(client):
    register_user(client)
    login = login_user(client)

    refresh_token = login.json()["refresh_token"]

    # Refresh endpoint
    res = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert res.status_code == 200

    new_tokens = res.json()
    assert "access_token" in new_tokens
    assert "refresh_token" in new_tokens
    assert new_tokens["refresh_token"] != refresh_token  # rotation!


def test_refresh_token_cannot_be_used_twice(client):
    register_user(client)
    login = login_user(client)

    refresh_token = login.json()["refresh_token"]

    # İlk kullanım OK
    first = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert first.status_code == 200

    # İkinci kullanım REVOKED olmalı
    second = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert second.status_code == 401


def test_logout_revokes_refresh_tokens(client):
    register_user(client)
    login = login_user(client)
    refresh_token = login.json()["refresh_token"]
    access_token = login.json()["access_token"]

    # logout
    res = client.post("/users/logout", headers={"Authorization": f"Bearer {access_token}"})
    assert res.status_code == 204

    # refresh artık kullanılamaz olmalı
    res2 = client.post("/users/refresh", json={"refresh_token": refresh_token})
    assert res2.status_code == 401
