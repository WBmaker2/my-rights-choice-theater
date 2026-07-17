import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TheaterApp } from "../app/theater/TheaterApp";

async function openFirstRightsScreen(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
  await user.click(screen.getByRole("button", { name: "첫 장면 보기" }));
  await user.click(screen.getByRole("button", { name: "다음 그림" }));
  await user.click(screen.getByRole("button", { name: "지켜져야 할 것 보기" }));
}

async function openFirstActionsScreen(user: ReturnType<typeof userEvent.setup>) {
  await openFirstRightsScreen(user);
  await user.click(screen.getByRole("button", { name: /내 생각을 말할 기회/ }));
  await user.click(screen.getByRole("button", { name: "도움 방법 살펴보기" }));
}

describe("초등 저학년 학생 사용성", () => {
  it("시작과 안내 화면에서 쉬운 말만 보여 준다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    expect(screen.getByText(/만든 이야기 속 친구/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/현재 진행/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
    expect(screen.getByText("어떤 방법을 써도 도움받을 수 있어요.")).toBeInTheDocument();
    expect(screen.queryByLabelText(/현재 진행/)).not.toBeInTheDocument();
  });

  it("쉬운 권리 이름과 네 개 이하의 도움 카드를 보여 준다", async () => {
    const user = userEvent.setup();
    const { container } = render(<TheaterApp />);

    await openFirstRightsScreen(user);
    expect(screen.getByRole("button", { name: /내 마음과 이름 지키기/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /안전하게 도움받기/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /내 생각을 말할 기회/ }));
    await user.click(screen.getByRole("button", { name: "도움 방법 살펴보기" }));

    expect(screen.queryByRole("button", { name: /다른 어른에게 다시 말하기/ })).not.toBeInTheDocument();
    expect(container.querySelectorAll(".choice-card")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /자리에서 나오기/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /어른에게 도와 달라고 하기/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "권리 카드 다시 보기" })).toBeInTheDocument();
  });

  it("장면을 마친 뒤에는 건너뛰기를 숨기고 다른 어른 경로를 유지한다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    await openFirstActionsScreen(user);
    await user.click(screen.getByRole("button", { name: "도움 문장 만들기" }));
    expect(screen.getByRole("button", { name: "도움 방법 다시 보기" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "어떻게 알려 줄지 고르기" }));
    await user.click(screen.getByRole("button", { name: "어른이 어떻게 돕는지 보기" }));
    expect(screen.queryByRole("button", { name: /이 장면 건너뛰기/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다른 어른에게 다시 말하는 방법" }));
    expect(screen.getByText("도움받을 때까지 어른들이 함께 도와야 해요.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "어른이 돕는 방법 다시 보기" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /이 장면 건너뛰기/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "이 장면 정리하기" }));
    expect(screen.getByText("함께 살펴본 내용")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /이 장면 건너뛰기/ })).not.toBeInTheDocument();
  });

  it("업데이트 내역에 학생 사용성 개선 날짜와 버전을 보여 준다", async () => {
    const user = userEvent.setup();
    render(<TheaterApp />);

    await user.click(screen.getByRole("button", { name: "업데이트 내역" }));
    expect(screen.getByText("2026-07-18 · v0.3.0")).toBeInTheDocument();
    expect(screen.getByText("초등학생이 읽기 쉬운 말과 화면 개선")).toBeInTheDocument();
  });
});
