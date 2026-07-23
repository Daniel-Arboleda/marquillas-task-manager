import PropTypes from "prop-types";

const PRIORITY_CONFIG = {
    low: {
        className: "priority-badge--low",
        icon: "⚪",
        label: "Low",
    },
    medium: {
        className: "priority-badge--medium",
        icon: "🟡",
        label: "Medium",
    },
    high: {
        className: "priority-badge--high",
        icon: "🔴",
        label: "High",
    },
};

export default function PriorityBadge({ priority }) {
    const {
        className,
        icon,
        label,
    } = PRIORITY_CONFIG[priority] ?? {
        className: "",
        icon: "⚪",
        label: priority || "-",
    };

    return (
        <span className={`priority-badge ${className}`}>
            {icon} {label}
        </span>
    );
}

PriorityBadge.propTypes = {
    priority: PropTypes.string,
};

PriorityBadge.defaultProps = {
    priority: "",
};