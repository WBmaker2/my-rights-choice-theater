interface AppHeaderProps {
  progress: string;
  stepLabel?: string;
  stepCurrent?: number;
  stepTotal?: number;
  showEnd: boolean;
  onUrgentHelp: () => void;
  onEnd: () => void;
}

export function AppHeader({ progress, stepLabel, stepCurrent, stepTotal, showEnd, onUrgentHelp, onEnd }: AppHeaderProps) {
  return (
    <header className="app-header">
      <a className="brand" href="#main-content" aria-label="내 권리 선택 극장 본문으로 이동">
        <span aria-hidden="true">🎭</span>
        <span>내 권리 선택 극장</span>
      </a>
      <div className="header-actions">
        <div className="progress-status" aria-label={stepLabel && stepCurrent && stepTotal ? `현재 진행 ${progress}, ${stepCurrent} / ${stepTotal} 단계 ${stepLabel}` : `현재 진행 ${progress}`}>
          <span className="progress-pill">{progress}</span>
          {stepLabel && stepCurrent && stepTotal && (
            <div className="step-progress">
              <span>{stepCurrent} / {stepTotal} · {stepLabel}</span>
              <progress max={stepTotal} value={stepCurrent}>{stepCurrent} / {stepTotal}</progress>
            </div>
          )}
        </div>
        <button className="button button-urgent" type="button" onClick={onUrgentHelp}>
          도움이 급할 때
        </button>
        {showEnd && (
          <button className="button button-quiet" type="button" onClick={onEnd}>
            활동 끝내기
          </button>
        )}
      </div>
    </header>
  );
}
