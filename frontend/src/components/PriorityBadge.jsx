const PRIORITY_LABELS = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
};

export default function PriorityBadge({ priority }) {
    return (
        <span className={`priority-badge priority-${priority}`}>
            {PRIORITY_LABELS[priority] ?? priority}
        </span>
    );
}