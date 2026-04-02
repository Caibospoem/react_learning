import json
import time

from app.core.constants import PROJECT_STATUS_PUBLISHED


def test_studio_project_clone_and_status_flow(client, auth_headers):
    create_response = client.post(
        "/api/studio/projects",
        headers=auth_headers,
        json={"name": "Studio Base", "description": "demo", "owner": "bocai"},
    )
    assert create_response.status_code == 201
    created = create_response.json()

    clone_response = client.post(
        f"/api/studio/projects/{created['id']}/clone",
        headers=auth_headers,
        json={"name": "Studio Clone"},
    )
    assert clone_response.status_code == 200
    cloned = clone_response.json()
    assert cloned["name"] == "Studio Clone"

    status_response = client.patch(
        f"/api/studio/projects/{created['id']}/status",
        headers=auth_headers,
        json={"status": "PUBLISHED"},
    )
    assert status_response.status_code == 200
    assert status_response.json()["status"] == PROJECT_STATUS_PUBLISHED


def test_studio_generate_task_writes_version(client, auth_headers):
    project_response = client.post(
        "/api/studio/projects",
        headers=auth_headers,
        json={"name": "Gen Project", "description": "gen", "owner": "bocai"},
    )
    assert project_response.status_code == 201
    project_id = project_response.json()["id"]

    task_response = client.post(
        f"/api/studio/projects/{project_id}/generate",
        headers=auth_headers,
        json={"prompt": "帮我生成一个 2D 横版关卡"},
    )
    assert task_response.status_code == 202
    task_id = task_response.json()["id"]

    deadline = time.time() + 12
    final_status = "QUEUED"
    while time.time() < deadline:
        detail = client.get(f"/api/studio/tasks/{task_id}", headers=auth_headers)
        assert detail.status_code == 200
        payload = detail.json()
        final_status = payload["status"]
        if final_status == "SUCCESS":
            break
        time.sleep(0.5)

    assert final_status == "SUCCESS"

    versions_response = client.get(
        f"/api/studio/projects/{project_id}/versions",
        headers=auth_headers,
    )
    assert versions_response.status_code == 200
    versions = versions_response.json()
    assert len(versions) >= 1
    assert versions[0]["map_data"]["rows"] > 0
    assert len(versions[0]["asset_manifest"]) >= 1


def test_assets_tags_and_versions(client, auth_headers):
    upload_response = client.post(
        "/api/assets/upload",
        headers=auth_headers,
        data={"tags": json.dumps(["ui", "json"])},
        files={"file": ("level.json", b'{"name":"v1"}', "application/json")},
    )
    assert upload_response.status_code == 201
    asset = upload_response.json()
    asset_id = asset["id"]
    assert asset["latest_version"] == 1
    assert "ui" in asset["tags"]

    tag_response = client.patch(
        f"/api/assets/{asset_id}/tags",
        headers=auth_headers,
        json={"tags": ["stage", "config"]},
    )
    assert tag_response.status_code == 200
    assert tag_response.json()["tags"] == ["stage", "config"]

    version_response = client.post(
        f"/api/assets/{asset_id}/versions",
        headers=auth_headers,
        files={"file": ("level.json", b'{"name":"v2"}', "application/json")},
    )
    assert version_response.status_code == 201
    assert version_response.json()["version_number"] == 2

    versions_response = client.get(f"/api/assets/{asset_id}/versions", headers=auth_headers)
    assert versions_response.status_code == 200
    assert len(versions_response.json()) == 2

    delete_response = client.delete(f"/api/assets/{asset_id}", headers=auth_headers)
    assert delete_response.status_code == 204


def test_delete_project_cleans_dependent_data(client, auth_headers):
    project_response = client.post(
        "/api/studio/projects",
        headers=auth_headers,
        json={"name": "Delete Project", "description": "cleanup", "owner": "bocai"},
    )
    assert project_response.status_code == 201
    project_id = project_response.json()["id"]

    upload_response = client.post(
        "/api/assets/upload",
        headers=auth_headers,
        data={"project_id": str(project_id)},
        files={"file": ("cleanup.json", b'{"name":"cleanup"}', "application/json")},
    )
    assert upload_response.status_code == 201

    delete_response = client.delete(f"/api/studio/projects/{project_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    list_projects_response = client.get("/api/studio/projects", headers=auth_headers)
    assert list_projects_response.status_code == 200
    all_ids = [item["id"] for item in list_projects_response.json()]
    assert project_id not in all_ids

    list_assets_response = client.get("/api/assets", headers=auth_headers, params={"project_id": project_id})
    assert list_assets_response.status_code == 200
    assert list_assets_response.json() == []


def test_system_runtime_exposes_mock_mode(client):
    health_response = client.get("/api/system/health")
    assert health_response.status_code == 200
    assert health_response.json()["status"] == "ok"

    runtime_response = client.get("/api/system/runtime")
    assert runtime_response.status_code == 200
    payload = runtime_response.json()
    assert payload["ai_mode"] == "mock"


def test_save_editor_map_as_version(client, auth_headers):
    project_response = client.post(
        "/api/studio/projects",
        headers=auth_headers,
        json={"name": "Editor Save", "description": "editor", "owner": "bocai"},
    )
    assert project_response.status_code == 201
    project_id = project_response.json()["id"]

    save_response = client.post(
        f"/api/studio/projects/{project_id}/versions",
        headers=auth_headers,
        json={
            "prompt": "编辑器保存",
            "summary": "手动编辑后保存",
            "map_data": {
                "rows": 12,
                "cols": 18,
                "tileSize": 24,
                "cells": {"11-0": "ground", "11-1": "ground"},
            },
            "asset_manifest": [],
        },
    )
    assert save_response.status_code == 201
    body = save_response.json()
    assert body["summary"] == "手动编辑后保存"
    assert body["map_data"]["rows"] == 12

    list_response = client.get(f"/api/studio/projects/{project_id}/versions", headers=auth_headers)
    assert list_response.status_code == 200
    versions = list_response.json()
    assert len(versions) >= 1
