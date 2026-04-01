import time

from fastapi.testclient import TestClient


def test_task_status_transitions_to_success(client: TestClient, auth_headers: dict[str, str]):
    create_response = client.post(
        "/api/tasks",
        headers=auth_headers,
        json={"name": "打包 Web 试玩版"},
    )
    assert create_response.status_code == 201
    created_task = create_response.json()
    assert created_task["status"] == "排队中"

    task_id = created_task["id"]
    final_task = created_task
    deadline = time.time() + 8

    while time.time() < deadline:
        detail_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
        assert detail_response.status_code == 200
        final_task = detail_response.json()
        if final_task["status"] == "成功":
            break
        time.sleep(0.4)

    assert final_task["status"] == "成功"
    assert final_task["result"] == "任务执行完成"
