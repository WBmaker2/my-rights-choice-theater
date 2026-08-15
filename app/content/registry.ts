import type { CommunicationMode, RightCard, SafeAction } from "../domain/types";

export const rights: RightCard[] = [
  {
    id: "self-respect",
    icon: "💛",
    label: "내 마음과 이름 지키기",
    description: "싫은 말이나 별명으로 마음이 다치지 않게 지켜져야 해요.",
  },
  {
    id: "participation",
    icon: "💬",
    label: "내 생각을 말할 기회",
    description: "내 생각을 말하고 다른 사람과 함께 들을 기회가 필요해요.",
  },
  {
    id: "privacy",
    icon: "🔐",
    label: "나의 사진과 정보",
    description: "사진과 이름 같은 내 정보는 함부로 나누면 안 돼요.",
  },
  {
    id: "protection",
    icon: "🛟",
    label: "안전하게 도움받기",
    description: "위험하거나 걱정될 때 어른의 도움을 받을 수 있어요.",
  },
  {
    id: "safe-play",
    icon: "🧩",
    label: "안전하게 놀기",
    description: "놀이는 안전해야 하고, 그만하고 싶을 때 멈출 수 있어요.",
  },
];

export const safeActions: SafeAction[] = [
  {
    id: "say-boundary",
    icon: "✋",
    label: "직접 말하기",
    description: "말해도 괜찮을 때, ‘그만하고 싶어요’라고 말해요.",
  },
  {
    id: "move-away",
    icon: "👣",
    label: "자리에서 나오기",
    description: "할 수 있다면 그 자리에서 나와, 도와줄 수 있는 어른에게 가요.",
  },
  {
    id: "show-help-card",
    icon: "🪪",
    label: "도움 카드 보여 주기",
    description: "말하기 어렵거나 원하지 않을 때 카드를 보여 줘도 돼요.",
  },
  {
    id: "ask-adult",
    icon: "🤝",
    label: "어른에게 도와 달라고 하기",
    description: "다른 일을 먼저 하지 않아도 돼요. 바로 어른에게 도와 달라고 해요.",
  },
  {
    id: "ask-another-adult",
    icon: "🔁",
    label: "다른 어른에게 다시 말하기",
    description: "한 어른이 바로 돕지 못하면 다른 어른에게 다시 요청해도 돼요.",
  },
  {
    id: "skip-scene",
    icon: "⏭️",
    label: "이 장면 건너뛰기",
    description: "이유를 말하지 않고 다음 장면으로 넘어갈 수 있어요.",
  },
];

export const communicationModes: Array<{
  id: CommunicationMode;
  icon: string;
  label: string;
  description: string;
}> = [
  { id: "speak", icon: "💬", label: "말하기", description: "문장을 소리 내어 말해요." },
  { id: "show-card", icon: "🪪", label: "카드 보여 주기", description: "큰 도움 카드를 보여 줘요." },
  { id: "point", icon: "👆", label: "문장 가리키기", description: "화면의 문장을 손가락으로 가리켜요." },
];

export const sources = [
  {
    id: "unicef-crc",
    label: "유엔아동권리협약 어린이용 설명",
    href: "https://www.unicef.org/reports/convention-rights-child-children-version",
    checkedAt: "2026-07-17",
  },
  {
    id: "unicef-korea-education",
    label: "유니세프한국위원회 아동권리교육",
    href: "https://www.unicef.or.kr/what-we-do/advocacy-for-children/child-rights-education",
    checkedAt: "2026-07-17",
  },
  {
    id: "mohw-112",
    label: "보건복지부 아동학대 신고 안내",
    href: "https://www.mohw.go.kr/menu.es?mid=a30301000000",
    checkedAt: "2026-07-17",
  },
];

export const updates = [
  {
    version: "0.4.1",
    date: "2026-08-16",
    title: "라이트 모드로 고정",
    detail: "브라우저의 다크 모드 설정과 관계없이 어린이가 읽기 편한 밝은 화면으로 보이도록 고정했어요.",
  },
  {
    version: "0.4.0",
    date: "2026-08-15",
    title: "장면별 학습 일러스트 추가",
    detail: "이모지 대신 생성 모델로 만든 5개 장면 일러스트를 연결해, 초등학생이 이야기 상황을 더 쉽게 이해하도록 바꿨어요.",
  },
  {
    version: "0.3.0",
    date: "2026-07-18",
    title: "초등학생이 읽기 쉬운 말과 화면 개선",
    detail: "어려운 표현을 쉬운 말로 바꾸고, 모바일 첫 화면과 도움 카드 수, 건너뛰기와 뒤로가기 버튼을 더 알아보기 쉽게 고쳤어요.",
  },
  {
    version: "0.2.0",
    date: "2026-07-17",
    title: "학생 흐름과 모바일 조작 개선",
    detail: "장면별 권리 카드를 3개로 줄이고, 단계 진행 표시와 종료 확인, 바로 보이는 건너뛰기와 뒤로가기를 추가했어요.",
  },
  {
    version: "0.1.0",
    date: "2026-07-17",
    title: "첫 검토용 버전",
    detail: "가상 장면 5개, 도움 문장 만들기, 여러 도움 경로와 어른 응답을 담았어요.",
  },
];
