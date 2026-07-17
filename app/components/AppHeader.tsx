interface AppHeaderProps {
  progress: string;
  onUrgentHelp: () => void;
  onEnd: () => void;
}

export function AppHeader({ progress, onUrgentHelp, onEnd }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="brand" href="#main-content" aria-label="내 권리 선택 극장 본문으로 이동">
        <span aria-hidden="true">🎭</span>
        <span>내 권리 선택 극장</span>
      </a>
      <div className="header-actions">
        <span className="progress-pill" aria-label={`현재 진행 ${progress}`}>{progress}</span>
        <button className="button button-urgent" type="button" onClick={onUrgentHelp}>
          도움이 급할 때
        </button>
        <button className="button button-quiet" type="button" onClick={onEnd}>
          활동 끝내기
        </button>
      </div>
    </header>
  );
}
