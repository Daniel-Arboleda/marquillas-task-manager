from fastapi.testclient import TestClient

from app.modules.users.user_model import User


def test_member_cannot_create_users(
    client: TestClient,
    member_token: str,
    auth_headers,
) -> None:
    response = client.post(
        "/api/users",
        json={
            "name": "Unauthorized User",
            "email": "unauthorized@test.local",
            "password": "Password123!",
            "role": "member",
        },
        headers=auth_headers(member_token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Forbidden"


def test_admin_can_create_user(
    client: TestClient,
    admin_token: str,
    auth_headers,
) -> None:
    response = client.post(
        "/api/users",
        json={
            "name": "Created Member",
            "email": "created.member@test.local",
            "password": "Password123!",
            "role": "member",
        },
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Created Member"
    assert body["email"] == "created.member@test.local"
    assert body["role"] == "member"
    assert body["is_active"] is True
    assert "password" not in body
    assert "password_hash" not in body


def test_admin_cannot_create_duplicate_email(
    client: TestClient,
    admin_user: User,
    admin_token: str,
    auth_headers,
) -> None:
    response = client.post(
        "/api/users",
        json={
            "name": "Duplicate Admin",
            "email": admin_user.email,
            "password": "Password123!",
            "role": "admin",
        },
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"