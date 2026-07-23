import PropTypes from "prop-types";

const EditIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="icon-button__icon"
    >
        <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42L18.21 3.29a1.003 1.003 0 0 0-1.42 0L14.71 5.37l3.75 3.75 2.25-1.91z"
        />
    </svg>
);

const DeleteIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="icon-button__icon"
    >
        <path
            fill="currentColor"
            d="M6 7h12v2H6zm2 3h2v8H8zm6 0h2v8h-2zM9 4h6l1 1h4v2H4V5h4z"
        />
    </svg>
);

const ICONS = {
    delete: DeleteIcon,
    edit: EditIcon,
};

export default function IconButton({
    icon,
    title,
    onClick,
    disabled,
    variant,
}) {
    const Icon = ICONS[icon];

    return (
        <button
            type="button"
            className={`icon-button icon-button--${variant}`}
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon && <Icon />}
        </button>
    );
}

IconButton.propTypes = {
    disabled: PropTypes.bool,
    icon: PropTypes.oneOf([
        "delete",
        "edit",
    ]).isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    variant: PropTypes.oneOf([
        "default",
        "primary",
        "danger",
    ]),
};

IconButton.defaultProps = {
    disabled: false,
    variant: "default",
};