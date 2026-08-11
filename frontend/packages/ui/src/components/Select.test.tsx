import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Select } from "./Form";

const OPTIONS = [
  { value: "public", label: "全体に公開" },
  { value: "friends", label: "フレンドのみ" },
  { value: "private", label: "自分だけ" },
] as const;

describe("Select", () => {
  it("いま選ばれている値を出す", () => {
    render(
      <Select
        label="公開範囲"
        value="friends"
        options={OPTIONS}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText<HTMLSelectElement>("公開範囲").value).toBe(
      "friends",
    );
  });

  it("選択肢をすべて出す", () => {
    render(
      <Select
        label="公開範囲"
        value="public"
        options={OPTIONS}
        onChange={() => {}}
      />,
    );
    expect(screen.getAllByRole("option")).toHaveLength(3);
    expect(screen.getByRole("option", { name: "自分だけ" })).toBeTruthy();
  });

  it("選ぶと値を渡す", () => {
    const onChange = vi.fn();
    render(
      <Select
        label="公開範囲"
        value="public"
        options={OPTIONS}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("公開範囲"), {
      target: { value: "private" },
    });
    expect(onChange).toHaveBeenCalledWith("private");
  });

  it("ラベルはスクリーンリーダーから引ける", () => {
    render(
      <Select
        label="書き出す範囲"
        value="public"
        options={OPTIONS}
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("書き出す範囲")).toBeTruthy();
  });
});
