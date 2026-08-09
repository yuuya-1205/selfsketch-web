"""app/main.py のエンドポイントのテスト。"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_healthz(client: TestClient) -> None:
    res = client.get("/healthz")

    assert res.status_code == 200
    assert res.json() == {"status": "ok"}
    assert res.headers["content-type"].startswith("application/json")


def test_ping(client: TestClient) -> None:
    res = client.get("/api/v1/ping")

    assert res.status_code == 200
    assert res.json() == {"message": "pong"}


@pytest.mark.parametrize("path", ["/api/v1/unknown", "/nope"])
def test_unknown_path_returns_404(client: TestClient, path: str) -> None:
    res = client.get(path)

    assert res.status_code == 404


def test_ping_rejects_post(client: TestClient) -> None:
    # /api/v1/ping は GET のみ。未定義メソッドは 405。
    res = client.post("/api/v1/ping")

    assert res.status_code == 405
