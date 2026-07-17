import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TheaterApp } from "../app/theater/TheaterApp";

describe("내 권리 선택 극장 흐름", () => {
  it("시작 안내에서 실제 경험을 묻지 않고 활동을 시작한다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    expect(screen.getByRole("heading", { name: "내 권리 선택 극장" })).toBeInTheDocument();
    expect(screen.getByText(/내 이야기를 말하지 않아도 돼요/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
    expect(screen.getByRole("heading", { name: "도움을 받는 방법은 하나가 아니에요" })).toBeInTheDocument();
  });

  it("도움이 급할 때 안내를 열고 닫아도 활동 상태를 유지한다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    await user.click(screen.getByRole("button", { name: "도움이 급할 때" }));
    expect(screen.getByRole("dialog", { name: "도움이 급할 때" })).toBeInTheDocument();
    expect(screen.getByText(/112/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "안내 닫기" }));
    expect(screen.getByRole("heading", { name: "내 권리 선택 극장" })).toBeInTheDocument();
  });
});
