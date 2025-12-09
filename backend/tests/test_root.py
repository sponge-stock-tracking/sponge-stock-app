# tests/test_root.py


def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    # Mesaj içeriği main.py'deki return ile eşleşmeli
    # Eğer main.py: {"message": "Welcome to the Sponge Stock Management API!"} ise:
    assert "Welcome" in res.json()["message"]