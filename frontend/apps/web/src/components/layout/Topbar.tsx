import { Bell, Menu, Search } from "lucide-react";
import { Avatar, IconButton } from "@selfsketch/ui";
import { useAppSelector } from "@/lib/store/hooks";
import { selectPageMeta } from "@/lib/store/uiSlice";

export function Topbar() {
  const { crumb, title } = useAppSelector(selectPageMeta);

  return (
    <header className="flex h-16 w-full shrink-0 items-center gap-4 border-b border-line bg-paper px-4 md:px-7">
      <IconButton label="メニューを開く" size={34} className="md:hidden">
        <Menu size={18} />
      </IconButton>

      <div className="flex flex-col gap-px">
        {crumb && (
          <span className="text-[10px] font-semibold tracking-[1.2px] text-muted">
            {crumb}
          </span>
        )}
        <h1 className="text-[18px] font-bold text-ink">{title}</h1>
      </div>

      <div className="h-px flex-1" />

      <label className="hidden h-9 w-[260px] items-center gap-2 rounded-[10px] border border-line bg-surface px-3 lg:flex">
        <Search size={14} className="shrink-0 text-muted" />
        <input
          type="search"
          placeholder="記録・習慣を検索"
          className="w-full bg-transparent text-xs text-ink placeholder:text-muted focus:outline-none"
        />
      </label>

      <IconButton label="通知" size={34}>
        <Bell size={16} />
      </IconButton>
      <Avatar initial="ゆ" size={32} />
    </header>
  );
}
