import PropTypes from "prop-types";

export default function TaskSummary({ tasks, loading }) {
    const items = tasks?.items ?? [];
    const summary = items.reduce((accumulator, { status }) => {
        accumulator.total += 1;
        if (status === "pending") {
            accumulator.pending += 1;
        } else if (status === "in_progress") {
            accumulator.inProgress += 1;
        } else if (status === "completed") {
            accumulator.completed += 1;
        } else if (status === "cancelled") {
            accumulator.cancelled += 1;
        }
        return accumulator;
    }, {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
    });

    const cards = [
        { key: "total", label: "Total", value: summary.total },
        { key: "pending", label: "Pending", value: summary.pending },
        { key: "inProgress", label: "In Progress", value: summary.inProgress },
        { key: "completed", label: "Completed", value: summary.completed },
        { key: "cancelled", label: "Cancelled", value: summary.cancelled },
    ];

    return (
        <div className="task-summary">
            {cards.map(({ key, label, value }) => (
                <div
                    key={key}
                    className={`task-summary-card task-summary-card--${key}`}
                >
                    <span className="task-summary-card__label">
                        {label}
                    </span>
                    <strong className="task-summary-card__value">
                        {loading ? "-" : value}
                    </strong>
                </div>
            ))}
        </div>
    );
}

TaskSummary.propTypes = {
    loading: PropTypes.bool,
    tasks: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            status: PropTypes.string,
        })),
    }),
};

TaskSummary.defaultProps = {
    loading: false,
    tasks: {
        items: [],
    },
};