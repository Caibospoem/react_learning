from fastapi.testclient import TestClient


def test_login_success(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"username": "bocai", "password": "123456"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"


def test_login_invalid_password(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"username": "bocai", "password": "wrong_password"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "用户名或密码错误"
