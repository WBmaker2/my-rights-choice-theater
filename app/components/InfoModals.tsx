import { sources, updates } from "../content/registry";
import { Modal } from "./Modal";

export type ModalName = "urgent" | "updates" | "teacher" | "end" | null;

interface InfoModalsProps {
  open: ModalName;
  onClose: () => void;
  onConfirmEnd: () => void;
}

export function InfoModals({ open, onClose, onConfirmEnd }: InfoModalsProps) {
  if (open === "urgent") {
    return (
      <Modal title="도움이 급할 때" onClose={onClose}>
        <div className="urgent-panel">
          <span className="modal-hero-icon" aria-hidden="true">🛟</span>
          <p className="modal-lead">지금 위험하거나 다친 사람이 있다면 이 활동을 멈춰요.</p>
          <p>가까운 어른에게 바로 알리거나 <strong>112</strong>에 도움을 요청해요.</p>
          <p className="small-note">이 앱은 신고를 보내거나 내 위치를 알리지 않아요.</p>
        </div>
      </Modal>
    );
  }

  if (open === "updates") {
    return (
      <Modal title="업데이트 내역" onClose={onClose}>
        <div className="timeline">
          {updates.map((update) => (
            <article key={update.version} className="timeline-item">
              <span>{update.date} · v{update.version}</span>
              <h3>{update.title}</h3>
              <p>{update.detail}</p>
            </article>
          ))}
        </div>
      </Modal>
    );
  }

  if (open === "teacher") {
    return (
      <Modal title="교사용 안내와 출처" onClose={onClose}>
        <div className="teacher-note">
          <p><strong>이 버전은 수업 전 검토용입니다.</strong> 학생에게 사용하기 전에 학교의 아동보호 기준과 장면 문구를 확인해 주세요.</p>
          <ul>
            <li>개인 경험 발표나 역할 재연을 요구하지 않아요.</li>
            <li>학생이 실제 일을 말하면 앱 활동보다 학교의 보호 절차를 먼저 따라요.</li>
            <li>결과를 점수나 수행평가 자료로 사용하지 않아요.</li>
          </ul>
          <h3>확인한 공식 자료</h3>
          <ul className="source-list">
            {sources.map((source) => (
              <li key={source.id}>
                <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                <span>확인일 {source.checkedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    );
  }

  if (open === "end") {
    return (
      <Modal title="활동을 끝낼까요?" onClose={onClose}>
        <div className="end-confirmation">
          <p>지금 끝내도 괜찮아요. 지금까지 고른 내용은 이 기기에 저장되지 않아요.</p>
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose}>계속하기</button>
            <button className="button button-primary" type="button" onClick={onConfirmEnd}>활동 끝내기</button>
          </div>
        </div>
      </Modal>
    );
  }

  return null;
}
