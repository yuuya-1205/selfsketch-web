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
npm run lint          # ESLint（flat config / typescript-eslint / react-hooks）
npm run format:check  # Prettier
npm run test:run      # Vitest + Testing Library（watch なし）
```

dev サーバーは `/api` を `http://localhost:8000`（backend）へプロキシする。

> `typescript` は 6 系に固定している。7 系はネイティブ移植版で JS コンパイラ API を持たず、
> typescript-eslint が起動時に落ちるため（typescript-eslint#10940）。

## backend

```bash
cd analysis/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt        # 本番用（fastapi / uvicorn のみ）
pip install -r requirements-dev.txt    # 開発用（pytest / httpx2 / ruff を追加）
uvicorn app.main:app --reload   # -> http://localhost:8000

ruff check .            # lint
ruff format --check .   # 整形チェック
python -m pytest        # tests/
```

- `GET /healthz` … ヘルスチェック
- `GET /api/v1/ping` … 疎通確認
