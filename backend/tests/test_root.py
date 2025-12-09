# tests/test_root.py

def test_root_endpoint(client):
    # 'client' fixture'ı conftest.py'den otomatik gelir ve app ile kurulmuştur.
    res = client.get("/")
    assert res.status_code == 200
    assert "Welcome" in res.json()["message"]