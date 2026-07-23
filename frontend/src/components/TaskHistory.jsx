function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString();
}

export default function TaskHistory({ history = [] }) {
    if (!history.length) {
        return (
            <div className="task-history-empty">
                No hay historial disponible.
            </div>
        );
    }

    return (
        <ol className="task-history">
            {history.map((item, index) => (
                <li
                    key={item.id ?? `${item.created_at ?? index}-${index}`}
                    className="task-history-item"
                >
                    <div className="task-history-header">
                        <strong>{item.user_name ?? "Sistema"}</strong>
                        <span>{formatDate(item.created_at)}</span>
                    </div>
                    <div className="task-history-body">
                        <span>{item.action}</span>
                        {item.field_name && (
                            <span> · {item.field_name}</span>
                        )}
                        {(item.previous_value !== null ||
                            item.new_value !== null) && (
                            <div className="task-history-change">
                                <span>{item.previous_value ?? "—"}</span>
                                <span>→</span>
                                <span>{item.new_value ?? "—"}</span>
                            </div>
                        )}
                        {item.event_type && (
                            <div className="task-history-event">
                                {item.event_type}
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}