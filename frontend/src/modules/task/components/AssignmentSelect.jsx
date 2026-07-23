import PropTypes from "prop-types";

export default function AssignmentSelect({
    assignedUserId,
    assignedUserName,
    assignedUserEmail,
    loading,
    options,
    onChange,
}) {
    const name = assignedUserName || "Unassigned";
    const email = assignedUserEmail || "";
    const initial = (assignedUserName?.trim()?.charAt(0) || "?").toUpperCase();

    return (
        <div className={`assignment-select${loading ? " assignment-select--loading" : ""}`}>
            <span className="assignment-select__avatar">
                {initial}
            </span>
            <div className="assignment-select__content">
                <span className="assignment-select__name">
                    {name}
                </span>
                <select
                    className="assignment-select__control"
                    value={assignedUserId || ""}
                    disabled={loading}
                    onChange={({ target }) => onChange(target.value)}
                >
                    <option value="">
                        Unassigned
                    </option>
                    {options.map(({ id, name: optionName }) => (
                        <option
                            key={id}
                            value={id}
                        >
                            {optionName}
                        </option>
                    ))}
                </select>
                {email && (
                    <span className="assignment-select__email">
                        {email}
                    </span>
                )}
            </div>
        </div>
    );
}

AssignmentSelect.propTypes = {
    assignedUserEmail: PropTypes.string,
    assignedUserId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    assignedUserName: PropTypes.string,
    loading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
};

AssignmentSelect.defaultProps = {
    assignedUserEmail: "",
    assignedUserId: "",
    assignedUserName: "",
    loading: false,
    options: [],
};