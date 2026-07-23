import PropTypes from "prop-types";
import AssignmentSelect from "./AssignmentSelect";
import IconButton from "./IconButton";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

const renderDueDate = (task) => {
    if (!task.dueDate) {
        return "-";
    }
    return (
        <>
            <div>{task.dueDate}</div>
            {task.isOverdue && (
                <small>{task.daysOverdue} day{task.daysOverdue === 1 ? "" : "s"} overdue</small>
            )}
        </>
    );
};

export default function TaskTable({
    tasks,
    loading,
    selectedIds,
    onToggleSelection,
    onSelectAll,
    onEdit,
    onDelete,
    isSelected,
    users,
    usersLoading,
    onAssignmentChange,
}) {
    const items = tasks?.items ?? [];

    return (
        <table className="task-table">
            <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            checked={items.length > 0 && selectedIds.length === items.length}
                            onChange={() => onSelectAll(items)}
                        />
                    </th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assigned User</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={7}>Loading...</td>
                    </tr>
                ) : items.length === 0 ? (
                    <tr>
                        <td colSpan={7}>No tasks found.</td>
                    </tr>
                ) : (
                    items.map((task) => (
                        <tr key={task.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={isSelected(task.id)}
                                    onChange={() => onToggleSelection(task.id)}
                                />
                            </td>
                            <td>{task.title}</td>
                            <td>
                                <StatusBadge status={task.status} />
                            </td>
                            <td>
                                <PriorityBadge priority={task.priority} />
                            </td>
                            <td>
                                <AssignmentSelect
                                    assignedUserId={task.assignedUserId}
                                    assignedUserName={task.assignedUserName}
                                    assignedUserEmail={task.assignedUserEmail}
                                    options={users}
                                    loading={usersLoading}
                                    onChange={(value) => onAssignmentChange(task, value)}
                                />
                            </td>
                            <td>{renderDueDate(task)}</td>
                            <td>
                                <div className="table-actions">
                                    <IconButton
                                        icon="edit"
                                        title="Edit task"
                                        onClick={() => onEdit(task)}
                                    />
                                    <IconButton
                                        icon="delete"
                                        title="Delete task"
                                        onClick={() => onDelete(task)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

TaskTable.propTypes = {
    isSelected: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    onAssignmentChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    onToggleSelection: PropTypes.func.isRequired,
    selectedIds: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    ).isRequired,
    tasks: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            assignedUserEmail: PropTypes.string,
            assignedUserId: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            assignedUserName: PropTypes.string,
            daysOverdue: PropTypes.number,
            dueDate: PropTypes.string,
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            isOverdue: PropTypes.bool,
            priority: PropTypes.string,
            status: PropTypes.string,
            title: PropTypes.string,
        })),
    }),
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

TaskTable.defaultProps = {
    loading: false,
    tasks: {
        items: [],
    },
    users: [],
    usersLoading: false,
};