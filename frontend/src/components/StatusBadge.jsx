const STATUS_LABELS = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
};

export default function StatusBadge({ status }) {
    return (
        <span className={`status-badge status-${status}`}>
            {STATUS_LABELS[status] ?? status}
        </span>
    );
}