import type { Scene } from "../domain/types";

interface SceneStageProps {
  scene: Scene;
  panelIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onContinue: () => void;
}

export function SceneStage({ scene, panelIndex, onPrevious, onNext, onContinue }: SceneStageProps) {
  const panel = scene.panels[panelIndex];
  const isLast = panelIndex === scene.panels.length - 1;

  return (
    <section className="screen-card scene-screen" aria-labelledby="scene-title">
      <div className="screen-eyebrow">{scene.eyebrow}</div>
      <h1 id="scene-title">{scene.title}</h1>
      <p className="fictional-note">{scene.fictionalNotice}</p>
      <div className={`scene-frame scene-tone-${panelIndex + 1}`}>
        <div className="scene-icon" aria-hidden="true">{panel.icon}</div>
        <div className="scene-copy">
          <span className="place-label">{panel.place}</span>
          <p>{panel.narration}</p>
          {panel.dialogue && <blockquote>“{panel.dialogue}”</blockquote>}
        </div>
        <p className="sr-only">{panel.altText}</p>
      </div>
      <div className="panel-dots" aria-label={`${scene.panels.length}개 장면 중 ${panelIndex + 1}번째`}>
        {scene.panels.map((item, index) => (
          <span key={item.id} className={index === panelIndex ? "dot dot-active" : "dot"} />
        ))}
      </div>
      <div className="navigation-row">
        <button className="button button-secondary" type="button" onClick={onPrevious} disabled={panelIndex === 0}>이전 그림</button>
        {isLast ? (
          <button className="button button-primary" type="button" onClick={onContinue}>지켜져야 할 것 보기</button>
        ) : (
          <button className="button button-primary" type="button" onClick={onNext}>다음 그림</button>
        )}
      </div>
    </section>
  );
}
