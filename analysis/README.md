# selfsketch analysis

SelfSketch の分析基盤。ダッシュボード（frontend）と集計 API（backend）の 2 層。

```
analysis/
├── frontend   React + TypeScript + Tailwind (Vite, localhost:5177)
└── backend    Python + FastAPI            (uvicorn, localhost:8000)
```

## frontend

```bash
cd analysis/frontend
npm install
npm run dev        # -> http://localhost:5177
npm run typecheck
npm run build
```

dev サーバーは `/api` を `http://localhost:8000`（backend）へプロキシする。

## backend

```bash
cd analysis/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # -> http://localhost:8000
```

- `GET /healthz` … ヘルスチェック
- `GET /api/v1/ping` … 疎通確認
