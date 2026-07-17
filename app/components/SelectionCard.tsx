interface SelectionCardProps {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectionCard({ icon, title, description, selected, onClick }: SelectionCardProps) {
  return (
    <button
      className={selected ? "choice-card choice-card-selected" : "choice-card"}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="choice-icon" aria-hidden="true">{icon}</span>
      <span className="choice-text">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <span className="choice-check" aria-hidden="true">{selected ? "✓" : "+"}</span>
    </button>
  );
}
