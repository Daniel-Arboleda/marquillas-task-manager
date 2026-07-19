import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleString();
}

export default function TaskTable({
    tasks,
    selectedRows = [],
    onSelectionChange,
    onView,
    onEdit,
}) {
    const allSelected = tasks.length > 0 &&
        tasks.every((task) => selectedRows.includes(task.id));

    function handleSelectAll(event) {
        onSelectionChange?.(
            event.target.checked
                ? tasks.map((task) => task.id)
                : [],
        );
    }

    function handleSelect(taskId, checked) {
        onSelectionChange?.(
            checked
                ? [...new Set([...selectedRows, taskId])]
                : selectedRows.filter((id) => id !== taskId),
        );
    }

    return (
        <div className="table-container">
            <table className="task-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={handleSelectAll}
                                aria-label="Select all tasks"
                            />
                        </th>
                        <th>
                            <button type="button">ID</button>
                        </th>
                        <th>
                            <button type="button">Title</button>
                        </th>
                        <th>
                            <button type="button">Status</button>
                        </th>
                        <th>
                            <button type="button">Priority</button>
                        </th>
                        <th>
                            <button type="button">Assigned</button>
                        </th>
                        <th>
                            <button type="button">Due Date</button>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr
                            key={task.id}
                            className={selectedRows.includes(task.id) ? "selected" : ""}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(task.id)}
                                    onChange={(event) =>
                                        handleSelect(task.id, event.target.checked)
                                    }
                                    aria-label={`Select task ${task.id}`}
                                />
                            </td>
                            <td>{task.id}</td>
                            <td>{task.title}</td>
                            <td>
                                <StatusBadge status={task.status} />
                            </td>
                            <td>
                                <PriorityBadge priority={task.priority} />
                            </td>
                            <td>{task.assigned_user_id ?? "-"}</td>
                            <td>{formatDate(task.due_date)}</td>
                            <td className="table-actions">
                                <button
                                    type="button"
                                    aria-label={`View task ${task.id}`}
                                    onClick={() => onView?.(task.id)}
                                >
                                    View
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Edit task ${task.id}`}
                                    onClick={() => onEdit?.(task.id)}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}