import { render, screen, within } from "@testing-library/react";
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

  it("활동 종료 전에 확인하고 계속하기를 고르면 현재 장면을 유지한다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
    await user.click(screen.getByRole("button", { name: "첫 장면 보기" }));
    await user.click(screen.getByRole("button", { name: "활동 끝내기" }));

    expect(screen.getByRole("dialog", { name: "활동을 끝낼까요?" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "계속하기" }));
    expect(screen.getByRole("heading", { name: "내 생각도 들을 차례예요" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "활동 끝내기" }));
    await user.click(within(screen.getByRole("dialog", { name: "활동을 끝낼까요?" })).getByRole("button", { name: "활동 끝내기" }));
    expect(screen.getByRole("heading", { name: "활동을 여기서 끝냈어요" })).toBeInTheDocument();
  });

  it("장면과 연결된 권리 카드 3개와 세부 진행 단계를 보여 준다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
    await user.click(screen.getByRole("button", { name: "첫 장면 보기" }));
    await user.click(screen.getByRole("button", { name: "다음 그림" }));
    await user.click(screen.getByRole("button", { name: "지켜져야 할 것 보기" }));

    expect(screen.getByLabelText("현재 진행 1 / 5 장면, 2 / 8 단계 지켜져야 할 것")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /내 생각을 말할 기회/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /내 마음과 이름 지키기/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /안전하게 도움받기/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /나의 사진과 정보/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /안전하게 놀기/ })).not.toBeInTheDocument();
  });

  it("새 화면으로 이동하면 제목에 초점을 옮긴다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
    expect(screen.getByRole("heading", { name: "도움을 받는 방법은 하나가 아니에요" })).toHaveFocus();
  });
});
