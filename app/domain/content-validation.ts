import type { Scene } from "./types";

const requiredActions = ["ask-adult", "show-help-card", "skip-scene"];
const forbiddenPatterns = [
  /왜\s*바로\s*말하지/,
  /했어야/,
  /착한\s*아이/,
  /나쁜\s*아이/,
  /용감\s*점수/,
  /아무에게도\s*말하지\s*않/,
  /네가\s*조심하면/,
  /이름을\s*입력/,
  /학급을\s*입력/,
  /연락처를\s*입력/,
];

export function validateSceneBank(scenes: Scene[]) {
  const errors: string[] = [];

  for (const scene of scenes) {
    for (const action of requiredActions) {
      if (!scene.actionOptions.includes(action as Scene["actionOptions"][number])) {
        errors.push(`${scene.id}: 필수 도움 경로 ${action} 없음`);
      }
    }

    if (scene.actionOptions.length < 4) errors.push(`${scene.id}: 안전 선택이 4개 미만`);
    if (scene.rightIds.length < 2) errors.push(`${scene.id}: 권리·필요가 2개 미만`);
    if (!scene.anotherAdult) errors.push(`${scene.id}: 다른 어른 경로 없음`);
    if (!scene.sourceIds.length) errors.push(`${scene.id}: 공식 출처 없음`);
    if (!scene.reviewVersion || !scene.reviewedAt) errors.push(`${scene.id}: 검토 이력 없음`);
    if (scene.adultResponse.responsibilities.length !== 4) errors.push(`${scene.id}: 어른 책임 요소 누락`);

    const studentCopy = JSON.stringify(scene);
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(studentCopy)) errors.push(`${scene.id}: 금지 문구 ${pattern.source}`);
    }
  }

  return errors;
}
