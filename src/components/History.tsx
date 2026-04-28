import type { HistoryEntry } from "../types";

interface HistoryProps {
  history: HistoryEntry[];
}

export default function History({ history }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="history">
        <div className="empty-state">
          <p>📭 No rewards yet. Start tracking!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-list">
        {[...history].reverse().map((entry, idx) => (
          <div key={idx} className="history-item">
            <div className="history-header">
              <span className="weight">{entry.weight}kg</span>
              <span className="date">{entry.date}</span>
            </div>
            <div className="history-reward">{entry.reward}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
