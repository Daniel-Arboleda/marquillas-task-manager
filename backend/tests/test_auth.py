from fastapi.testclient import TestClient

from app.modules.users.user_model import User


def test_login_returns_access_token(
    client: TestClient,
    member_user: User,
) -> None:
    response = client.post(
        "/api/auth/login",
        json={
            "email": member_user.email,
            "password": "Password123!",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["access_token"], str)
    assert body["access_token"]
    assert body["token_type"] == "bearer"
    assert body["expires_in"] > 0


def test_login_rejects_invalid_credentials(
    client: TestClient,
    member_user: User,
) -> None:
    response = client.post(
        "/api/auth/login",
        json={
            "email": member_user.email,
            "password": "InvalidPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_me_returns_authenticated_user(
    client: TestClient,
    member_user: User,
    member_token: str,
    auth_headers,
) -> None:
    response = client.get(
        "/api/auth/me",
        headers=auth_headers(member_token),
    )

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == member_user.id
    assert body["email"] == member_user.email
    assert body["role"] == "member"


def test_me_rejects_missing_token(client: TestClient) -> None:
    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"