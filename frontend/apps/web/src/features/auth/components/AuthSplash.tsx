/**
 * セッションを確かめているあいだのつなぎ。
 * ここで待たずに未ログイン扱いにすると、リロードのたびに
 * ログイン画面が一瞬見えてしまう。
 */
export function AuthSplash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper">
      <div className="flex flex-col items-center gap-3">
        <span className="grid size-[30px] place-items-center rounded-[10px] bg-ink text-sm leading-none font-bold text-paper">
          ◆
        </span>
        <span className="text-[11px] font-bold tracking-[2px] text-muted">
          LOADING
        </span>
      </div>
    </div>
  );
}
