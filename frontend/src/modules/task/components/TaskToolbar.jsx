import PropTypes from "prop-types";
import { TASK_PRIORITY, TASK_STATUS } from "../services/taskDefaults";

export default function TaskToolbar({
    filters,
    users,
    usersLoading,
    onSearch,
    onStatusChange,
    onPriorityChange,
    onAssignedUserChange,
    onClear,
    onCreate,
}) {
    return (
        <div className="task-toolbar">
            <div className="task-toolbar__search">
                <input
                    type="search"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={({ target }) => onSearch(target.value)}
                />
            </div>
            <div className="task-toolbar__filters">
                <select
                    value={filters.status}
                    onChange={({ target }) => onStatusChange(target.value)}
                >
                    <option value="">All Status</option>
                    {TASK_STATUS.map((status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    ))}
                </select>
                <select
                    value={filters.priority}
                    onChange={({ target }) => onPriorityChange(target.value)}
                >
                    <option value="">All Priority</option>
                    {TASK_PRIORITY.map((priority) => (
                        <option
                            key={priority}
                            value={priority}
                        >
                            {priority}
                        </option>
                    ))}
                </select>
                <select
                    value={filters.assignedUserId || ""}
                    disabled={usersLoading}
                    onChange={({ target }) => onAssignedUserChange(target.value)}
                >
                    <option value="">
                        All Users
                    </option>
                    {users.map(({ id, name }) => (
                        <option
                            key={id}
                            value={id}
                        >
                            {name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="task-toolbar__actions">
                <button
                    type="button"
                    onClick={onClear}
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={onCreate}
                >
                    + Create Task
                </button>
            </div>
        </div>
    );
}

TaskToolbar.propTypes = {
    filters: PropTypes.shape({
        assignedUserId: PropTypes.string,
        priority: PropTypes.string,
        search: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
    onAssignedUserChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onPriorityChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
            name: PropTypes.string.isRequired,
        }),
    ),
    usersLoading: PropTypes.bool,
};

TaskToolbar.defaultProps = {
    users: [],
    usersLoading: false,
};