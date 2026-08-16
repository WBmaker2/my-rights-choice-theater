"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { InfoModals, type ModalName } from "../components/InfoModals";
import { SceneStage } from "../components/SceneStage";
import { SelectionCard } from "../components/SelectionCard";
import { communicationModes, rights, safeActions } from "../content/registry";
import { sceneBank } from "../content/scenes";
import { buildHelpSentence } from "../domain/help-sentence";
import type { CommunicationMode, RightId, SafeActionId } from "../domain/types";

type Screen =
  | "welcome"
  | "guide"
  | "scene"
  | "rights"
  | "actions"
  | "builder"
  | "delivery"
  | "adult"
  | "another"
  | "summary"
  | "session"
  | "ended";

interface CollectedSentence {
  sceneId: string;
  sceneTitle: string;
  text: string;
  mode: CommunicationMode;
}

const activityScreens: Screen[] = [
  "scene",
  "rights",
  "actions",
  "builder",
  "delivery",
  "adult",
  "another",
  "summary",
];

const skippableScreens: Screen[] = ["scene", "rights", "actions", "builder", "delivery"];

const activityStepLabels: Partial<Record<Screen, string>> = {
  scene: "장면 보기",
  rights: "지켜져야 할 것",
  actions: "도움 방법",
  builder: "도움 문장",
  delivery: "어떻게 알리기",
  adult: "어른의 도움",
  another: "다른 어른에게 알리기",
  summary: "함께 본 내용",
};

export function TheaterApp() {
  const mainRef = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [modal, setModal] = useState<ModalName>(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [panelIndex, setPanelIndex] = useState(0);
  const [selectedRights, setSelectedRights] = useState<RightId[]>([]);
  const [selectedActions, setSelectedActions] = useState<SafeActionId[]>([]);
  const [factIndex, setFactIndex] = useState(0);
  const [boundaryIndex, setBoundaryIndex] = useState<number | null>(null);
  const [helpIndex, setHelpIndex] = useState(0);
  const [mode, setMode] = useState<CommunicationMode>("show-card");
  const [collected, setCollected] = useState<CollectedSentence[]>([]);

  const scene = sceneBank[sceneIndex];
  const sentence = useMemo(
    () => buildHelpSentence({
      fact: scene.factPhrases[factIndex],
      boundary: boundaryIndex === null ? undefined : scene.boundaryPhrases[boundaryIndex],
      help: scene.helpPhrases[helpIndex],
    }),
    [boundaryIndex, factIndex, helpIndex, scene],
  );

  const progress = screen === "welcome" || screen === "guide"
    ? screen === "welcome" ? "시작" : "안내"
    : screen === "session" || screen === "ended"
      ? "마무리"
      : `${sceneIndex + 1} / ${sceneBank.length} 장면`;
  const activityStepIndex = activityScreens.indexOf(screen);
  const stepLabel = activityStepLabels[screen];
  const canSkipScene = skippableScreens.includes(screen);

  useEffect(() => {
    const heading = mainRef.current?.querySelector<HTMLElement>("h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [sceneIndex, screen]);

  function resetSceneChoices() {
    setPanelIndex(0);
    setSelectedRights([]);
    setSelectedActions([]);
    setFactIndex(0);
    setBoundaryIndex(null);
    setHelpIndex(0);
    setMode("show-card");
  }

  function moveToNextScene() {
    if (sceneIndex === sceneBank.length - 1) {
      setScreen("session");
      setModal("completion");
      return;
    }
    setSceneIndex((index) => index + 1);
    resetSceneChoices();
    setScreen("scene");
  }

  function skipScene() {
    moveToNextScene();
  }

  function saveSentenceAndContinue() {
    setCollected((items) => {
      const withoutCurrent = items.filter((item) => item.sceneId !== scene.id);
      return [...withoutCurrent, { sceneId: scene.id, sceneTitle: scene.title, text: sentence, mode }];
    });
    setScreen("adult");
  }

  function toggleRight(id: RightId) {
    setSelectedRights((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function toggleAction(id: SafeActionId) {
    setSelectedActions((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function restart() {
    setModal(null);
    setSceneIndex(0);
    setCollected([]);
    resetSceneChoices();
    setScreen("welcome");
  }

  return (
    <div className="app-shell">
      <AppHeader
        progress={progress}
        stepLabel={stepLabel}
        stepCurrent={activityStepIndex >= 0 ? activityStepIndex + 1 : undefined}
        stepTotal={activityScreens.length}
        showProgress={screen !== "welcome" && screen !== "guide"}
        showEnd={activityStepIndex >= 0}
        onUrgentHelp={() => setModal("urgent")}
        onEnd={() => setModal("end")}
      />

      {canSkipScene && (
        <div className="skip-bar">
          <span>보고 싶지 않은 장면은 이유 없이 넘어가도 돼요.</span>
          <button type="button" onClick={skipScene}>이 장면 건너뛰기 <span aria-hidden="true">→</span></button>
        </div>
      )}

      <main id="main-content" className="main-content" ref={mainRef}>
        {screen === "welcome" && (
          <section className="welcome-grid" aria-labelledby="welcome-title">
            <div className="welcome-copy">
              <span className="kicker">모든 어린이에게 꼭 지켜져야 하는 것</span>
              <h1 id="welcome-title">내 권리 선택 극장</h1>
              <p className="welcome-lead">만든 이야기 속 친구를 보며, 친구에게 필요한 것과 도움받는 방법을 찾아봐요.</p>
              <div className="safety-promise">
                <span aria-hidden="true">🌿</span>
                <p><strong>내 이야기를 말하지 않아도 돼요.</strong> 여기 나오는 일은 모두 만든 이야기예요.</p>
              </div>
              <div className="welcome-actions">
                <button className="button button-primary button-large" type="button" onClick={() => setScreen("guide")}>극장 안내 보기</button>
                <button className="button button-secondary button-large" type="button" onClick={() => setModal("teacher")}>선생님과 보호자 안내</button>
              </div>
              <p className="privacy-line"><span aria-hidden="true">🔒</span> 이름, 사진, 목소리, 내가 겪은 일을 묻거나 저장하지 않아요.</p>
            </div>
            <div className="ticket-stack" aria-label="활동에서 기억할 세 가지">
              <article className="ticket ticket-peach">
                <span>01</span><strong>권리는 선물이 아니에요.</strong><p>모든 어린이에게 있어요.</p>
              </article>
              <article className="ticket ticket-blue">
                <span>02</span><strong>도움 방법은 여러 가지예요.</strong><p>말하거나, 보여 주거나, 가리켜도 돼요.</p>
              </article>
              <article className="ticket ticket-green">
                <span>03</span><strong>보호할 책임은 어른에게 있어요.</strong><p>바로 말하지 못해도 네 잘못이 아니에요.</p>
              </article>
            </div>
          </section>
        )}

        {screen === "guide" && (
          <section className="screen-card guide-screen" aria-labelledby="guide-title">
            <span className="screen-eyebrow">시작하기 전에</span>
            <h1 id="guide-title">도움을 받는 방법은 하나가 아니에요</h1>
            <p className="screen-intro">어떤 방법을 써도 도움받을 수 있어요.</p>
            <div className="guide-options">
              {communicationModes.map((item) => (
                <article key={item.id} className="guide-card">
                  <span aria-hidden="true">{item.icon}</span><h2>{item.label}</h2><p>{item.description}</p>
                </article>
              ))}
            </div>
            <div className="guide-reminder">
              <strong>기억해요</strong>
              <p>보고 싶지 않은 장면은 이유를 말하지 않고 언제든 건너뛸 수 있어요.</p>
            </div>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("welcome")}>처음으로</button>
              <button className="button button-primary" type="button" onClick={() => setScreen("scene")}>첫 장면 보기</button>
            </div>
          </section>
        )}

        {screen === "scene" && (
          <SceneStage
            scene={scene}
            panelIndex={panelIndex}
            onPrevious={() => setPanelIndex((index) => Math.max(0, index - 1))}
            onNext={() => setPanelIndex((index) => Math.min(scene.panels.length - 1, index + 1))}
            onContinue={() => setScreen("rights")}
          />
        )}

        {screen === "rights" && (
          <section className="screen-card" aria-labelledby="rights-title">
            <span className="screen-eyebrow">{scene.title}</span>
            <h1 id="rights-title">무엇이 지켜져야 할까요?</h1>
            <p className="screen-intro">필요한 것은 여러 개일 수 있어요. 필요하다고 생각하는 카드를 골라 보세요.</p>
            <div className="choice-grid">
              {rights.filter((right) => scene.rightOptions.includes(right.id)).map((right) => (
                <SelectionCard key={right.id} icon={right.icon} title={right.label} description={right.description} selected={selectedRights.includes(right.id)} onClick={() => toggleRight(right.id)} />
              ))}
            </div>
            {selectedRights.length > 0 && (
              <div className="kind-feedback" role="status">
                <strong>좋은 생각이에요.</strong> 이 장면에서는 {rights.filter((right) => scene.rightIds.includes(right.id)).map((right) => right.label).join("과 ")}도 함께 지켜져야 해요.
              </div>
            )}
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("scene")}>장면 다시 보기</button>
              <button className="button button-primary" type="button" disabled={!selectedRights.length} onClick={() => setScreen("actions")}>도움 방법 살펴보기</button>
            </div>
          </section>
        )}

        {screen === "actions" && (
          <section className="screen-card" aria-labelledby="actions-title">
            <span className="screen-eyebrow">안전한 선택</span>
            <h1 id="actions-title">어떤 방법을 써 볼 수 있을까요?</h1>
            <p className="screen-intro">여러 개를 골라도 돼요. 바로 도움 문장으로 가도 괜찮아요.</p>
            <div className="choice-grid">
              {safeActions.filter((action) => scene.actionOptions.includes(action.id) && action.id !== "skip-scene" && action.id !== "ask-another-adult").map((action) => (
                <SelectionCard key={action.id} icon={action.icon} title={action.label} description={action.description} selected={selectedActions.includes(action.id)} onClick={() => toggleAction(action.id)} />
              ))}
            </div>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("rights")}>권리 카드 다시 보기</button>
              <button className="button button-primary" type="button" onClick={() => setScreen("builder")}>도움 문장 만들기</button>
            </div>
          </section>
        )}

        {screen === "builder" && (
          <section className="screen-card" aria-labelledby="builder-title">
            <span className="screen-eyebrow">도움 문장 만들기</span>
            <h1 id="builder-title">짧은 문장을 이어 보세요</h1>
            <p className="screen-intro">내 이야기를 쓰는 곳이 아니에요. 만든 이야기 속 친구의 문장만 골라요.</p>
            <div className="sentence-builder">
              <PhraseGroup label="1. 무슨 일이 있었나요?" phrases={scene.factPhrases} selected={factIndex} onSelect={(index) => index !== null && setFactIndex(index)} />
              <PhraseGroup label="2. 하고 싶은 말 (넣지 않아도 돼요)" phrases={scene.boundaryPhrases} selected={boundaryIndex} onSelect={setBoundaryIndex} optional />
              <PhraseGroup label="3. 어떤 도움이 필요한가요?" phrases={scene.helpPhrases} selected={helpIndex} onSelect={(index) => index !== null && setHelpIndex(index)} />
            </div>
            <div className="sentence-preview" aria-live="polite"><span>이렇게 말할 수 있어요</span><p>{sentence}</p></div>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("actions")}>도움 방법 다시 보기</button>
              <button className="button button-primary" type="button" onClick={() => setScreen("delivery")}>어떻게 알려 줄지 고르기</button>
            </div>
          </section>
        )}

        {screen === "delivery" && (
          <section className="screen-card" aria-labelledby="delivery-title">
            <span className="screen-eyebrow">어떻게 알려 줄까요?</span>
            <h1 id="delivery-title">편한 방법을 골라요</h1>
            <p className="screen-intro">말해도, 카드를 보여 줘도, 문장을 가리켜도 도움을 받을 수 있어요.</p>
            <div className="delivery-grid">
              {communicationModes.map((item) => (
                <button key={item.id} className={mode === item.id ? "delivery-card delivery-card-selected" : "delivery-card"} type="button" aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>
                  <span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong><small>{item.description}</small>
                </button>
              ))}
            </div>
            <div className="help-card-preview"><span>도움이 필요해요</span><p>{sentence}</p></div>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("builder")}>문장 바꾸기</button>
              <button className="button button-primary" type="button" onClick={saveSentenceAndContinue}>어른이 어떻게 돕는지 보기</button>
            </div>
          </section>
        )}

        {screen === "adult" && (
          <section className="screen-card adult-screen" aria-labelledby="adult-title">
            <span className="screen-eyebrow">어른은 이렇게 도와야 해요</span>
            <h1 id="adult-title">어른은 듣고 안전하게 도와야 해요</h1>
            <blockquote className="adult-quote">“{scene.adultResponse.message}”</blockquote>
            <h2>어른이 할 일</h2>
            <ul className="responsibility-list">
              {scene.adultResponse.responsibilities.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
            </ul>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("delivery")}>도움 카드 다시 보기</button>
              <button className="button button-primary" type="button" onClick={() => setScreen("another")}>다른 어른에게 다시 말하는 방법</button>
            </div>
          </section>
        )}

        {screen === "another" && (
          <section className="screen-card another-screen" aria-labelledby="another-title">
            <span className="big-icon" aria-hidden="true">🔁</span>
            <h1 id="another-title">한 어른이 바로 돕지 못해도</h1>
            <p className="another-lead">{scene.anotherAdult}</p>
            <div className="kind-feedback"><strong>다시 말해도 괜찮아요.</strong> 도움받을 때까지 어른들이 함께 도와야 해요.</div>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("adult")}>어른이 돕는 방법 다시 보기</button>
              <button className="button button-primary" type="button" onClick={() => setScreen("summary")}>이 장면 정리하기</button>
            </div>
          </section>
        )}

        {screen === "summary" && (
          <section className="screen-card" aria-labelledby="summary-title">
            <span className="screen-eyebrow">함께 살펴본 내용</span>
            <h1 id="summary-title">{scene.title}</h1>
            <div className="summary-columns">
              <article><span aria-hidden="true">💛</span><h2>지켜져야 할 것</h2><p>{rights.filter((right) => scene.rightIds.includes(right.id)).map((right) => right.label).join(", ")}</p></article>
              <article><span aria-hidden="true">🛟</span><h2>도움받는 방법</h2><p>말하기, 자리에서 나오기, 카드 보여 주기, 어른에게 가기</p></article>
              <article><span aria-hidden="true">🤝</span><h2>어른이 할 일</h2><p>이야기를 듣고, 안전하게 돕고, 필요한 어른과 함께하기</p></article>
            </div>
            <div className="navigation-row">
              <button className="button button-secondary" type="button" onClick={() => setScreen("adult")}>어른이 돕는 방법 다시 보기</button>
              <button className="button button-primary" type="button" onClick={moveToNextScene}>{sceneIndex === sceneBank.length - 1 ? "나의 도움 문장 모음" : "다음 장면 보기"}</button>
            </div>
          </section>
        )}

        {screen === "session" && (
          <section className="screen-card session-screen" aria-labelledby="session-title">
            <span className="celebration" aria-hidden="true">🌈</span>
            <h1 id="session-title">나의 도움 문장 모음</h1>
            <p className="screen-intro">점수도 정답 수도 없어요. 편한 방법으로 도움을 요청할 수 있다는 것을 기억해요.</p>
            {collected.length ? (
              <div className="sentence-collection">
                {collected.map((item) => <article key={item.sceneId}><span>{item.sceneTitle}</span><p>{item.text}</p></article>)}
              </div>
            ) : <div className="empty-summary">장면을 모두 건너뛰어도 괜찮아요. 이유를 말할 필요가 없어요.</div>}
            <div className="final-promise"><strong>모든 어린이는 안전하고 존중받아야 해요.</strong><p>바로 말하지 못했어도 네 잘못이 아니에요.</p></div>
            <button className="button button-primary button-large" type="button" onClick={restart}>처음부터 다시 보기</button>
          </section>
        )}

        {screen === "ended" && (
          <section className="screen-card ended-screen" aria-labelledby="ended-title">
            <span className="big-icon" aria-hidden="true">🌿</span>
            <h1 id="ended-title">활동을 여기서 끝냈어요</h1>
            <p>끝까지 하지 않아도 괜찮아요. 어떤 이유인지 말할 필요도 없어요.</p>
            <div className="welcome-actions">
              <button className="button button-primary" type="button" onClick={restart}>처음 화면으로</button>
              <button className="button button-secondary" type="button" onClick={() => setModal("urgent")}>도움이 급할 때</button>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>이 앱은 상담·신고·위험 판단을 하지 않아요.</p>
        <div><button type="button" onClick={() => setModal("teacher")}>교사용 안내</button><button type="button" onClick={() => setModal("updates")}>업데이트 내역</button></div>
      </footer>

      <InfoModals
        open={modal}
        onClose={() => setModal(null)}
        onRestart={restart}
        onConfirmEnd={() => {
          setModal(null);
          setScreen("ended");
        }}
      />
    </div>
  );
}

interface PhraseGroupProps {
  label: string;
  phrases: string[];
  selected: number | null;
  onSelect: (index: number | null) => void;
  optional?: boolean;
}

function PhraseGroup({ label, phrases, selected, onSelect, optional }: PhraseGroupProps) {
  return (
    <fieldset className="phrase-group">
      <legend>{label}</legend>
      <div>
        {optional && <button className={selected === null ? "phrase-chip phrase-chip-selected" : "phrase-chip"} type="button" onClick={() => onSelect(null)}>넣지 않을래요</button>}
        {phrases.map((phrase, index) => (
          <button key={phrase} className={selected === index ? "phrase-chip phrase-chip-selected" : "phrase-chip"} type="button" onClick={() => onSelect(index)}>{phrase}</button>
        ))}
      </div>
    </fieldset>
  );
}
