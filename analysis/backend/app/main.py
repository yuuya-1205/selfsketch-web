"""SelfSketch 分析バックエンド。

習慣・ジャーナルなどのデータを集計して analysis/frontend に返す API。
エンドポイントは /api/v1 以下に追加していく。
"""

from fastapi import FastAPI

app = FastAPI(title="SelfSketch Analysis API")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1/ping")
def ping() -> dict[str, str]:
    return {"message": "pong"}
