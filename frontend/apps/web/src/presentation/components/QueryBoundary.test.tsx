import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import type { ReactNode } from "react";
import { domainError } from "@/domain/error";
import type { RepositoryResult } from "@/domain/repository/result";
import { QueryBoundary } from "./QueryBoundary";

const wrap = (ui: ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

const loaded: RepositoryResult<string> = {
  data: "本文",
  isLoading: false,
  error: null,
};

describe("QueryBoundary", () => {
  it("成功したら中身を出す", () => {
    wrap(
      <QueryBoundary state={loaded} skeleton={<p>読み込み中</p>}>
        {(data) => <p>{data}</p>}
      </QueryBoundary>,
    );
    expect(screen.getByText("本文")).toBeTruthy();
  });

  it("読み込み中はプレースホルダを出す", () => {
    wrap(
      <QueryBoundary
        state={{ data: undefined, isLoading: true, error: null }}
        skeleton={<p>読み込み中</p>}
      >
        {() => <p>本文</p>}
      </QueryBoundary>,
    );
    expect(screen.getByText("読み込み中")).toBeTruthy();
  });

  it("isLoading が false でもデータが無ければ待つ", () => {
    wrap(
      <QueryBoundary
        state={{ data: undefined, isLoading: false, error: null }}
        skeleton={<p>読み込み中</p>}
      >
        {() => <p>本文</p>}
      </QueryBoundary>,
    );
    expect(screen.getByText("読み込み中")).toBeTruthy();
  });

  it("code ごとに文言を出し分け、detail は画面に出さない", () => {
    wrap(
      <QueryBoundary
        state={{
          data: undefined,
          isLoading: false,
          error: domainError("network", "FETCH_ERROR at /api/v1/today"),
        }}
        skeleton={<p>読み込み中</p>}
      >
        {() => <p>本文</p>}
      </QueryBoundary>,
    );

    expect(screen.getByText("つながりませんでした")).toBeTruthy();
    expect(screen.queryByText(/FETCH_ERROR/)).toBeNull();
  });

  it("再試行を渡すとボタンが出る", () => {
    const onRetry = vi.fn();
    wrap(
      <QueryBoundary
        state={{
          data: undefined,
          isLoading: false,
          error: domainError("unknown", "boom"),
        }}
        skeleton={<p>読み込み中</p>}
        onRetry={onRetry}
      >
        {() => <p>本文</p>}
      </QueryBoundary>,
    );

    const button = screen.getByRole("button", { name: "再試行" });
    button.click();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("期限切れは再試行ではなくログインへ送る", () => {
    wrap(
      <QueryBoundary
        state={{
          data: undefined,
          isLoading: false,
          error: domainError("unauthorized", "401"),
        }}
        skeleton={<p>読み込み中</p>}
        onRetry={() => {}}
      >
        {() => <p>本文</p>}
      </QueryBoundary>,
    );

    expect(screen.getByRole("button", { name: "ログインする" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "再試行" })).toBeNull();
  });

  it("inline のときは他の内容が出ていることを添える", () => {
    wrap(
      <QueryBoundary
        state={{
          data: undefined,
          isLoading: false,
          error: domainError("network", "offline"),
        }}
        skeleton={<p>読み込み中</p>}
        inline
      >
        {() => <p>本文</p>}
      </QueryBoundary>,
    );

    expect(screen.getByText("他の内容は表示できています。")).toBeTruthy();
  });
});
