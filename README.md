# 내 권리 선택 극장

초등 1~2학년 학생이 검수용 가상 생활 장면을 살펴보고, 지켜져야 할 권리와 여러 안전한 도움 요청 방법을 연습하는 정적 교육용 웹앱입니다.

## 중요한 사용 경계

- 이 앱은 상담, 신고 접수, 위험 진단, 심리검사, 법률 판단을 하지 않습니다.
- 이름, 학급, 연락처, 위치, 사진, 음성, 실제 경험, 자유 글을 입력받거나 저장하지 않습니다.
- 학생이 직접 말하지 못하거나 장면을 건너뛰어도 실패로 평가하지 않습니다.
- 학생의 실제 발화가 나오면 앱 활동을 이어 가며 자세히 묻지 않고 학교의 아동보호 절차를 우선합니다.
- 현재 장면 문구는 `review-ready` 상태의 교사용 검토본입니다. 실제 수업 전 담임교사, 학교 상담·아동보호 실무자, 아동권리교육 전문가, 접근성 검토자의 확인이 필요합니다.

## 핵심 흐름

`가상 장면 보기 → 지켜져야 할 것 고르기 → 여러 안전 선택 살펴보기 → 도움 문장 만들기 → 전달 방법 고르기 → 책임 있는 어른의 응답 → 다른 어른 경로 → 점수 없는 정리`

## 개발 확인

```bash
npm run dev
npm test
npm run lint
npx tsc --noEmit
```

## 공식 자료

- [유니세프 아동권리협약 어린이용 설명](https://www.unicef.org/reports/convention-rights-child-children-version)
- [유니세프한국위원회 아동권리교육](https://www.unicef.or.kr/what-we-do/advocacy-for-children/child-rights-education)
- [보건복지부 아동학대 신고 안내](https://www.mohw.go.kr/menu.es?mid=a30301000000)

공식 자료와 도움 정보의 마지막 확인일은 2026-07-17입니다.

## GitHub Pages

이 프로젝트는 검수된 가상 장면과 브라우저 메모리만 사용하는 정적 앱으로
GitHub Pages에서도 사용할 수 있습니다.

- `npm run build:pages`: GitHub Pages용 정적 사이트 빌드
- 공개 주소: https://wbmaker2.github.io/my-rights-choice-theater/
- 배포 방식: `.github/workflows/deploy-pages.yml`
- 정적 진입점: `pages/index.html`
