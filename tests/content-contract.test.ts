import { describe, expect, it } from "vitest";
import { sceneBank } from "../app/content/scenes";
import { validateSceneBank } from "../app/domain/content-validation";

describe("검토용 장면 은행", () => {
  it("안내 뒤에 살펴볼 본 장면 5개를 제공한다", () => {
    expect(sceneBank).toHaveLength(5);
    expect(new Set(sceneBank.map((scene) => scene.id)).size).toBe(5);
  });

  it("모든 장면에 말하기 외 도움 경로와 다른 어른 경로가 있다", () => {
    for (const scene of sceneBank) {
      expect(scene.actionOptions).toEqual(
        expect.arrayContaining(["ask-adult", "show-help-card", "skip-scene"]),
      );
      expect(scene.actionOptions.length).toBeGreaterThanOrEqual(4);
      expect(scene.anotherAdult).toBeTruthy();
      expect(scene.sensitivityTier).toBeLessThanOrEqual(2);
    }
  });

  it("학생 책임 전가와 개인정보 수집 문구를 거부한다", () => {
    expect(validateSceneBank(sceneBank)).toEqual([]);
  });
});
