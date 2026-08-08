import { Route, Routes } from "react-router";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder />} />
    </Routes>
  );
}

function Placeholder() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-2 bg-slate-50 text-slate-800">
      <h1 className="text-2xl font-semibold">SelfSketch Analysis</h1>
      <p className="text-sm text-slate-500">
        分析ダッシュボード（準備中）。API は <code>analysis/backend</code>（FastAPI）から配信予定。
      </p>
    </main>
  );
}
