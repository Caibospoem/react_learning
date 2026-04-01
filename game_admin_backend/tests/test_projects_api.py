from fastapi.testclient import TestClient


def test_projects_requires_auth(client: TestClient):
    response = client.get("/api/projects")
    assert response.status_code == 403


def test_projects_crud_flow(client: TestClient, auth_headers: dict[str, str]):
    create_response = client.post(
        "/api/projects",
        headers=auth_headers,
        json={
            "name": "AI 横版冒险项目",
            "description": "用于测试项目 CRUD",
            "status": "进行中",
            "owner": "bocai",
        },
    )
    assert create_response.status_code == 201
    created_project = create_response.json()
    project_id = created_project["id"]
    assert created_project["name"] == "AI 横版冒险项目"

    update_response = client.put(
        f"/api/projects/{project_id}",
        headers=auth_headers,
        json={
            "name": "AI 横版冒险项目-更新",
            "description": "项目状态更新",
            "status": "已发布",
            "owner": "bocai",
        },
    )
    assert update_response.status_code == 200
    updated_project = update_response.json()
    assert updated_project["name"] == "AI 横版冒险项目-更新"
    assert updated_project["status"] == "已发布"

    list_response = client.get("/api/projects", headers=auth_headers)
    assert list_response.status_code == 200
    all_ids = [item["id"] for item in list_response.json()]
    assert project_id in all_ids

    delete_response = client.delete(f"/api/projects/{project_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    list_after_delete = client.get("/api/projects", headers=auth_headers)
    assert list_after_delete.status_code == 200
    all_ids_after_delete = [item["id"] for item in list_after_delete.json()]
    assert project_id not in all_ids_after_delete
