import { describe, expect, it } from "vitest";
import { buildHelpSentence } from "../app/domain/help-sentence";

describe("도움 문장 조립", () => {
  it("사실과 필요한 도움만으로 문장을 완성한다", () => {
    expect(
      buildHelpSentence({
        fact: "제 사진을 묻지 않고 올리려고 해요.",
        help: "올리지 않도록 도와주세요.",
      }),
    ).toBe("제 사진을 묻지 않고 올리려고 해요. 올리지 않도록 도와주세요.");
  });

  it("경계 표현은 원할 때만 가운데에 넣는다", () => {
    expect(
      buildHelpSentence({
        fact: "별명을 계속 불러요.",
        boundary: "저는 그만하고 싶어요.",
        help: "멈출 수 있게 도와주세요.",
      }),
    ).toBe("별명을 계속 불러요. 저는 그만하고 싶어요. 멈출 수 있게 도와주세요.");
  });
});
