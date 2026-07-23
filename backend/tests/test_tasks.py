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

    assert [task["id"] for task in body["items"]] == [completed_task.id]

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

    assert [task["id"] for task in body["items"]] == [critical_task.id]


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

    assert [task["id"] for task in body["items"]] == [assigned_task.id]


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

    assert [task["id"] for task in body["items"]] == expected_ids


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

    body = response.json()

    returned_ids = {
        task["id"]
        for task in body["items"]
    }

    assert returned_ids == {
        owned_task.id,
        assigned_task.id,
    }


def test_admin_summary_returns_global_counts(
    client: TestClient,
    admin_token: str,
    admin_user: User,
    auth_headers,
    task_factory,
) -> None:
    task_factory(
        title="Pending",
        created_by=admin_user.id,
        status="pending",
        priority="low",
    )
    task_factory(
        title="In Progress",
        created_by=admin_user.id,
        status="in_progress",
        priority="medium",
    )
    task_factory(
        title="Completed",
        created_by=admin_user.id,
        status="completed",
        priority="high",
    )

    response = client.get(
        "/api/tasks/summary",
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 3
    assert body["pending"] == 1
    assert body["in_progress"] == 1
    assert body["completed"] == 1
    assert body["low_priority"] == 1
    assert body["medium_priority"] == 1
    assert body["high_priority"] == 1


def test_member_summary_returns_only_visible_tasks(
    client: TestClient,
    member_user: User,
    other_member_user: User,
    member_token: str,
    auth_headers,
    task_factory,
) -> None:
    task_factory(
        title="Owned",
        created_by=member_user.id,
        status="pending",
    )

    task_factory(
        title="Assigned",
        created_by=other_member_user.id,
        assigned_user_id=member_user.id,
        status="completed",
    )

    task_factory(
        title="Hidden",
        created_by=other_member_user.id,
        assigned_user_id=other_member_user.id,
        status="pending",
    )

    response = client.get(
        "/api/tasks/summary",
        headers=auth_headers(member_token),
    )

    assert response.status_code == 200

    body = response.json()

    assert body["total"] == 2
    assert body["pending"] == 1
    assert body["completed"] == 1


def test_summary_requires_authentication(
    client: TestClient,
) -> None:
    response = client.get("/api/tasks/summary")

    assert response.status_code == 401


def test_summary_changes_after_task_creation(
    client: TestClient,
    member_token: str,
    auth_headers,
) -> None:
    before = client.get(
        "/api/tasks/summary",
        headers=auth_headers(member_token),
    ).json()

    create_response = client.post(
        "/api/tasks",
        json=task_payload(),
        headers=auth_headers(member_token),
    )

    assert create_response.status_code == 201

    after = client.get(
        "/api/tasks/summary",
        headers=auth_headers(member_token),
    ).json()

    assert after["total"] == before["total"] + 1
    assert after["pending"] == before["pending"] + 1


def test_summary_changes_after_status_update(
    client: TestClient,
    member_user: User,
    member_token: str,
    auth_headers,
    task_factory,
) -> None:
    task = task_factory(
        title="Status update",
        created_by=member_user.id,
        status="pending",
    )

    before = client.get(
        "/api/tasks/summary",
        headers=auth_headers(member_token),
    ).json()

    response = client.patch(
        f"/api/tasks/{task.id}",
        json={"status": "completed"},
        headers=auth_headers(member_token),
    )

    assert response.status_code == 200

    after = client.get(
        "/api/tasks/summary",
        headers=auth_headers(member_token),
    ).json()

    assert after["pending"] == before["pending"] - 1
    assert after["completed"] == before["completed"] + 1


def test_filter_by_assigned_user_returns_expected_tasks(
    client: TestClient,
    admin_user: User,
    member_user: User,
    other_member_user: User,
    admin_token: str,
    auth_headers,
    task_factory,
) -> None:
    expected = task_factory(
        title="Expected",
        created_by=admin_user.id,
        assigned_user_id=member_user.id,
    )

    task_factory(
        title="Ignored",
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

    assert [task["id"] for task in body["items"]] == [expected.id]


def test_search_filter_returns_matching_tasks(
    client: TestClient,
    admin_user: User,
    admin_token: str,
    auth_headers,
    task_factory,
) -> None:
    matching = task_factory(
        title="Hydraulic inspection",
        created_by=admin_user.id,
    )

    task_factory(
        title="Electrical maintenance",
        created_by=admin_user.id,
    )

    response = client.get(
        "/api/tasks",
        params={"search": "Hydraulic"},
        headers=auth_headers(admin_token),
    )

    assert response.status_code == 200

    body = response.json()

    assert [task["id"] for task in body["items"]] == [matching.id]