import PropTypes from "prop-types";

const STATUS_CONFIG = {
    pending: {
        className: "status-badge--pending",
        icon: "🟡",
        label: "Pending",
    },
    in_progress: {
        className: "status-badge--in-progress",
        icon: "🔵",
        label: "In Progress",
    },
    completed: {
        className: "status-badge--completed",
        icon: "🟢",
        label: "Completed",
    },
    cancelled: {
        className: "status-badge--cancelled",
        icon: "🔴",
        label: "Cancelled",
    },
};

export default function StatusBadge({ status }) {
    const {
        className,
        icon,
        label,
    } = STATUS_CONFIG[status] ?? {
        className: "",
        icon: "⚪",
        label: status || "-",
    };

    return (
        <span className={`status-badge ${className}`}>
            {icon} {label}
        </span>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.string,
};

StatusBadge.defaultProps = {
    status: "",
};