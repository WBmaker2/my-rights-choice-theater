# 초등 저학년 실사용 개선 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 초등학교 1~2학년이 읽기 쉬운 문장과 예측 가능한 조작 흐름을 제공하고, 검증된 결과를 기존 Sites 프로젝트에 공개 배포합니다.

**Architecture:** 기존 React 로컬 상태와 5개 장면·8단계 구조를 유지합니다. 학생용 정적 문장은 콘텐츠 레지스트리와 화면 컴포넌트에서 바꾸고, 화면 상태로 진행 표시와 건너뛰기 노출을 계산합니다. 새 개인정보 수집이나 저장 기능은 추가하지 않습니다.

**Tech Stack:** React 19, Next.js 16, TypeScript 5.9, Vitest, Testing Library, Vinext, Sites

**Implementation Status:** 2026-07-18 구현 및 로컬 실사용 재검증 완료. Sites 공개 배포 진행 중.

## Global Constraints

- 대상 사용자는 초등학교 1~2학년 학생입니다.
- 실제 경험, 이름, 사진, 목소리, 위치를 입력하거나 저장하지 않습니다.
- 말하기, 카드 보여 주기, 문장 가리키기를 똑같이 유효한 도움 요청으로 유지합니다.
- 장면 건너뛰기와 활동 끝내기는 이유 설명 없이 사용할 수 있어야 합니다.
- 다른 어른에게 다시 알리는 전용 단계를 모든 장면에서 유지합니다.
- 긴급 도움 안내와 `112` 정보는 바꾸지 않습니다.
- 모든 코드 파일은 500줄 미만이어야 합니다.
- 앱 버전과 업데이트 내역은 `0.3.0`, `2026-07-18`로 맞춥니다.
- 기존 Sites `project_id`를 재사용하고, 성공 상태가 확인된 공개 배포 URL만 보고합니다.

---

### Task 1: 학생 흐름 회귀 테스트 작성

**Files:**
- Create: `tests/student-usability.test.tsx`

**Interfaces:**
- Consumes: `TheaterApp()`
- Produces: 쉬운 문장, 카드 수, 구체적인 버튼, 건너뛰기 범위, 다른 어른 경로를 고정하는 회귀 테스트

- [ ] **Step 1: 실패하는 학생 문장·헤더 테스트 작성**

```tsx
it("시작과 안내 화면에서 쉬운 말만 보여 준다", async () => {
  const user = userEvent.setup();
  render(<TheaterApp />);
  expect(screen.getByText(/만든 이야기 속 친구/)).toBeInTheDocument();
  expect(screen.queryByLabelText(/현재 진행/)).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "극장 안내 보기" }));
  expect(screen.getByText("어떤 방법을 써도 도움받을 수 있어요.")).toBeInTheDocument();
});
```

- [ ] **Step 2: 실패를 확인**

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: 새 쉬운 문장이 아직 없어서 FAIL

- [ ] **Step 3: 실패하는 활동 흐름 테스트 작성**

`극장 안내 보기 → 첫 장면 보기 → 다음 그림 → 지켜져야 할 것 보기`로 이동하고 다음을 검증합니다.

```tsx
expect(screen.getByRole("button", { name: /내 마음과 이름 지키기/ })).toBeInTheDocument();
expect(screen.getByRole("button", { name: /안전하게 도움받기/ })).toBeInTheDocument();
await user.click(screen.getByRole("button", { name: /내 생각을 말할 기회/ }));
await user.click(screen.getByRole("button", { name: "도움 방법 살펴보기" }));
expect(screen.queryByRole("button", { name: /다른 어른에게 다시 말하기/ })).not.toBeInTheDocument();
expect(screen.getAllByRole("button").filter((button) => button.classList.contains("choice-card"))).toHaveLength(4);
expect(screen.getByRole("button", { name: "권리 카드 다시 보기" })).toBeInTheDocument();
```

- [ ] **Step 4: 실패를 확인**

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: 기존 권리 카드 문장과 5개 도움 카드 때문에 FAIL

---

### Task 2: 쉬운 문장과 도움 카드 수 구현

**Files:**
- Modify: `app/content/registry.ts`
- Modify: `app/theater/TheaterApp.tsx`
- Test: `tests/student-usability.test.tsx`

**Interfaces:**
- Consumes: `rights`, `safeActions`, `scene.actionOptions`
- Produces: `visibleActions` 배열과 확정된 학생용 문장

- [ ] **Step 1: 권리 카드 이름 변경**

```ts
label: "내 마음과 이름 지키기"
label: "안전하게 도움받기"
```

- [ ] **Step 2: 화면 문장을 설계표대로 변경**

`TheaterApp.tsx`에서 첫 화면 소개, 안내 설명, 권리 설명, 도움 방법 설명, 도움 문장 안내·미리 보기, 전달 단계, 어른 응답, 다른 어른 안내, 장면 정리 문장을 설계 명세의 확정 문장과 일치시킵니다.

- [ ] **Step 3: 도움 카드 필터를 최대 4개로 제한**

```tsx
safeActions.filter(
  (action) => scene.actionOptions.includes(action.id)
    && action.id !== "skip-scene"
    && action.id !== "ask-another-adult",
)
```

- [ ] **Step 4: 학생 사용성 테스트 실행**

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: 문장·카드 수 관련 테스트 PASS

---

### Task 3: 진행 표시·건너뛰기·이동 버튼 구현

**Files:**
- Modify: `app/components/AppHeader.tsx`
- Modify: `app/theater/TheaterApp.tsx`
- Modify: `app/styles/base.css`
- Test: `tests/student-usability.test.tsx`

**Interfaces:**
- Consumes: `screen`, `activityStepIndex`
- Produces: `showProgress: boolean`, `skippableScreens`, 목적지가 보이는 이동 버튼

- [ ] **Step 1: 실패하는 건너뛰기 범위 테스트 추가**

도움 문장을 정하고 `adult → another → summary`로 이동하면서 각 화면에서 다음을 검증합니다.

```tsx
expect(screen.queryByRole("button", { name: /이 장면 건너뛰기/ })).not.toBeInTheDocument();
expect(screen.getByText("도움받을 때까지 어른들이 함께 도와야 해요.")).toBeInTheDocument();
```

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: `adult` 화면에 건너뛰기가 남아 있어 FAIL

- [ ] **Step 2: 건너뛰기 가능 화면을 명시**

```ts
const skippableScreens: Screen[] = ["scene", "rights", "actions", "builder", "delivery"];
const canSkipScene = skippableScreens.includes(screen);
```

`skip-bar`는 `canSkipScene`일 때만 렌더링합니다.

- [ ] **Step 3: 헤더 진행 표시를 선택적으로 렌더링**

```tsx
interface AppHeaderProps {
  showProgress: boolean;
  // 기존 속성 유지
}

{showProgress && (
  <div className="progress-status" aria-label={progressLabel}>
    {/* 기존 진행 표시 */}
  </div>
)}
```

`TheaterApp`은 `showProgress={screen !== "welcome" && screen !== "guide"}`를 전달합니다.

- [ ] **Step 4: 구체적인 이전 버튼 적용**

```tsx
<button ...>권리 카드 다시 보기</button>
<button ...>도움 방법 다시 보기</button>
```

- [ ] **Step 5: 모바일 터치 영역과 한 줄 헤더 적용**

```css
.brand {
  min-width: 44px;
  min-height: 48px;
}

@media (max-width: 760px) {
  .app-header:not(:has(.progress-status)) {
    align-items: center;
  }
}
```

- [ ] **Step 6: 학생 사용성 테스트 실행**

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: 모든 학생 사용성 테스트 PASS

---

### Task 4: 업데이트 내역과 앱 버전 기록

**Files:**
- Modify: `app/content/registry.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/student-usability.test.tsx`

**Interfaces:**
- Consumes: `updates`
- Produces: 앱 버전 `0.3.0`과 화면에 보이는 2026-07-18 개선 기록

- [ ] **Step 1: 실패하는 업데이트 내역 테스트 추가**

```tsx
await user.click(screen.getByRole("button", { name: "업데이트 내역" }));
expect(screen.getByText("2026-07-18 · v0.3.0")).toBeInTheDocument();
expect(screen.getByText("초등학생이 읽기 쉬운 말과 화면 개선")).toBeInTheDocument();
```

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: v0.3.0 기록이 없어서 FAIL

- [ ] **Step 2: 업데이트 항목을 맨 앞에 추가**

```ts
{
  version: "0.3.0",
  date: "2026-07-18",
  title: "초등학생이 읽기 쉬운 말과 화면 개선",
  detail: "어려운 표현을 쉬운 말로 바꾸고, 모바일 첫 화면과 도움 카드 수, 건너뛰기와 뒤로가기 버튼을 더 알아보기 쉽게 고쳤어요.",
}
```

- [ ] **Step 3: 패키지 버전 변경**

`package.json`, `package-lock.json`, `package-lock.json`의 루트 패키지 항목을 모두 `0.3.0`으로 맞춥니다.

- [ ] **Step 4: 업데이트 테스트 실행**

Run: `npm run test:unit -- tests/student-usability.test.tsx`

Expected: PASS

---

### Task 5: 전체 검증과 학생 관점 브라우저 재점검

**Files:**
- Update: `.gstack/design-reports/design-audit-my-rights-choice-theater-student-2026-07-18.md`
- Create: `.gstack/design-reports/screenshots/student-*-after.png`

**Interfaces:**
- Consumes: 완성된 앱
- Produces: 자동 검증 결과, 모바일·태블릿·데스크톱 개선 후 증거

- [ ] **Step 1: 정적 검증**

Run: `git diff --check && npm run lint && npm test`

Expected: exit code 0, 테스트 실패 0개, 빌드 성공

- [ ] **Step 2: 파일 길이 검증**

Run: `wc -l app/theater/TheaterApp.tsx app/components/AppHeader.tsx app/content/registry.ts app/styles/base.css tests/student-usability.test.tsx`

Expected: 모든 파일 500줄 미만

- [ ] **Step 3: 프로덕션 서버에서 실제 흐름 재점검**

375×812, 768×1024, 1280×720에서 시작부터 장면 정리까지 이동합니다. 가로 넘침, 44px 미만 터치 영역, 콘솔 오류, 완료 뒤 건너뛰기 노출이 없어야 합니다.

- [ ] **Step 4: 개선 후 스크린샷과 점검 결과 기록**

시작·안내·도움 방법·어른 응답·다른 어른·장면 정리 화면을 동일한 이름의 `after` 스크린샷으로 남기고, 점검 문서에 구현 결과와 남은 브라우저 확인 사항을 추가합니다.

---

### Task 6: 검증된 소스 커밋과 Sites 공개 배포

**Files:**
- Modify: `.openai/hosting.json` only if the existing `project_id` is missing or invalid
- Create: `/tmp/my-rights-choice-theater-v0.3.0.tar.gz`

**Interfaces:**
- Consumes: 전체 검증을 통과한 현재 HEAD, 기존 Sites `project_id`
- Produces: 새 Sites 버전과 공개 배포 URL

- [ ] **Step 1: 구현 문서와 소스를 한 커밋으로 확정**

```bash
git add docs/superpowers app tests package.json package-lock.json
git commit -m "feat: simplify student learning flow"
```

- [ ] **Step 2: Sites 소스 저장소 자격으로 현재 HEAD를 푸시**

기존 프로젝트의 단기 쓰기 자격을 받아 토큰을 원격 URL이나 Git 설정에 남기지 않고, 한 명령의 HTTP 인증 헤더로 기본 브랜치 HEAD를 푸시합니다.

- [ ] **Step 3: Sites 배포 아카이브 생성**

Run: `/Users/kimhongnyeon/.codex/plugins/cache/openai-bundled/sites/0.1.30/scripts/package-site.sh /Users/kimhongnyeon/Dev/codex/my-rights-choice-theater /tmp/my-rights-choice-theater-v0.3.0.tar.gz`

Expected: `dist/server/index.js`, 정적 자산, `dist/.openai/hosting.json`을 포함한 아카이브 생성

- [ ] **Step 4: 현재 HEAD로 Sites 버전 저장 및 공개 배포**

현재 HEAD SHA와 아카이브로 버전을 한 번 저장하고 공개 배포합니다. 사용자가 공개 배포를 명시 승인했으므로 추가 접근 승인 질문은 하지 않습니다.

- [ ] **Step 5: 배포 성공 상태와 공개 접근 확인**

배포 상태가 `succeeded`가 될 때까지 직접 확인하고, 반환된 정확한 공개 URL을 열어 HTTP 응답과 첫 화면 제목을 확인합니다.
