from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient

from app.modules.tasks.task_model import Task
from app.modules.users.user_model import User


def task_payload(**overrides) -> dict:
    payload = {
        "title": "Prepare technical report",
        "description": "Compile the relevant operational findings",
        "priority": "medium",
        "due_date": (datetime.now(UTC) + timedelta(days=1)).isoformat(),
    }
    payload.update(overrides)
    return payload


def test_create_task_rejects_blank_title(
    client: TestClient,
    member_token: str,
    auth_headers,
) -> None:
    response = client.post(
        "/api/tasks",
        json=task_payload(title="   "),
        headers=auth_headers(member_token),
    )

    assert response.status_code == 422


def test_create_task_rejects_invalid_priority(
    client: TestClient,
    member_token: str,
    auth_headers,
) -> None:
    response = client.post(
        "/api/tasks",
        json=task_payload(priority="urgentissima"),
        headers=auth_headers(member_token),
    )

    assert response.status_code == 422


def test_create_task_rejects_past_due_date(
    client: TestClient,
    member_token: str,
    auth_headers,
) -> None:
    response = client.post(
        "/api/tasks",
        json=task_payload(
            due_date=(datetime.now(UTC) - timedelta(days=1)).isoformat(),
        ),
        headers=auth_headers(member_token),
    )

    assert response.status_code == 422


def test_member_cannot_get_unrelated_task(
    client: TestClient,
    member_user: User,
    other_member_user: User,
    member_token: str,
    auth_headers,
    task_factory,
) -> None:
    task = task_factory(
        title="Private task",
        created_by=other_member_user.id,
        assigned_user_id=other_member_user.id,
    )

    response = client.get(
        f"/api/tasks/{task.id}",
        headers=auth_headers(member_token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient permissions"


def test_member_cannot_reassign_task(
    client: TestClient,
    member_user: User,
    other_member_user: User,
    member_token: str,
    auth_headers,
    task_factory,
) -> None:
    task = task_factory(
        title="Member task",
        created_by=member_user.id,
        assigned_user_id=member_user.id,
    )

    response = client.patch(
        f"/api/tasks/{task.id}",
        json={"assigned_user_id": other_member_user.id},
        headers=auth_headers(member_token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Only administrators can reassign tasks"


def test_admin_can_get_and_reassign_task(
    client: TestClient,
    admin_token: str,
    member_user: User,
    other_member_user: User,
    auth_headers,
    task_factory,
) -> None:
    task = task_factory(
        title="Task available to admin",
        created_by=member_user.id,
        assigned_user_id=member_user.id,
    )

    get_response = client.get(
        f"/api/tasks/{task.id}",
        headers=auth_headers(admin_token),
    )
    update_response = client.patch(
        f"/api/tasks/{task.id}",
        json={"assigned_user_id": other_member_user.id},
        headers=auth_headers(admin_token),
    )

    assert get_response.status_code == 200
    assert update_response.status_code == 200
    assert update_response.json()["assigned_user_id"] == other_member_user.id


def test_admin_filters_tasks_by_status(
    client: TestClient,
    admin_token: str,
    admin_user: User,
    auth_headers,
    task_factory,
) -> None:
    task_factory(
        title="Pending task",
        created_by=admin_user.id,
        status="pending",
    )
    completed_task = task_factory(
        title="Completed task",
        created_by=admin_user.id,
        status="completed",
    )

    response = client.get(
        "/api/tasks",
        params={"status": "completed"},
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 200
    body = response.json()
<<<<<<< HEAD
    assert [task["id"] for task in body] == [completed_task.id]
=======
    assert [task["id"] for task in body["items"]] == [completed_task.id]
>>>>>>> development


def test_admin_filters_tasks_by_priority(
    client: TestClient,
    admin_token: str,
    admin_user: User,
    auth_headers,
    task_factory,
) -> None:
    task_factory(
        title="Low priority task",
        created_by=admin_user.id,
        priority="low",
    )
    critical_task = task_factory(
        title="Critical task",
        created_by=admin_user.id,
        priority="critical",
    )

    response = client.get(
        "/api/tasks",
        params={"priority": "critical"},
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 200
    body = response.json()
<<<<<<< HEAD
    assert [task["id"] for task in body] == [critical_task.id]
=======
    assert [task["id"] for task in body["items"]] == [critical_task.id]
>>>>>>> development


def test_admin_filters_tasks_by_assigned_user(
    client: TestClient,
    admin_token: str,
    admin_user: User,
    member_user: User,
    other_member_user: User,
    auth_headers,
    task_factory,
) -> None:
    assigned_task = task_factory(
        title="Assigned task",
        created_by=admin_user.id,
        assigned_user_id=member_user.id,
    )
    task_factory(
        title="Other assigned task",
        created_by=admin_user.id,
        assigned_user_id=other_member_user.id,
    )

    response = client.get(
        "/api/tasks",
        params={"assigned_user_id": member_user.id},
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 200
    body = response.json()
<<<<<<< HEAD
    assert [task["id"] for task in body] == [assigned_task.id]
=======
    assert [task["id"] for task in body["items"]] == [assigned_task.id]
>>>>>>> development


def test_task_list_applies_pagination(
    client: TestClient,
    admin_token: str,
    admin_user: User,
    auth_headers,
    task_factory,
) -> None:
    tasks: list[Task] = [
        task_factory(
            title=f"Task {number}",
            created_by=admin_user.id,
        )
        for number in range(1, 6)
    ]

    response = client.get(
        "/api/tasks",
        params={"page": 2, "page_size": 2},
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 200
    body = response.json()
    expected_ids = [tasks[2].id, tasks[1].id]
<<<<<<< HEAD
    assert [task["id"] for task in body] == expected_ids
=======
    assert [task["id"] for task in body["items"]] == expected_ids
>>>>>>> development


def test_member_list_contains_only_owned_or_assigned_tasks(
    client: TestClient,
    member_user: User,
    other_member_user: User,
    member_token: str,
    auth_headers,
    task_factory,
) -> None:
    owned_task = task_factory(
        title="Owned task",
        created_by=member_user.id,
    )
    assigned_task = task_factory(
        title="Assigned task",
        created_by=other_member_user.id,
        assigned_user_id=member_user.id,
    )
    task_factory(
        title="Unrelated task",
        created_by=other_member_user.id,
        assigned_user_id=other_member_user.id,
    )

    response = client.get(
        "/api/tasks",
        headers=auth_headers(member_token),
    )

    assert response.status_code == 200
<<<<<<< HEAD
    returned_ids = {task["id"] for task in response.json()}
=======
    body = response.json()
    returned_ids = {task["id"] for task in body["items"]}
>>>>>>> development
    assert returned_ids == {owned_task.id, assigned_task.id}