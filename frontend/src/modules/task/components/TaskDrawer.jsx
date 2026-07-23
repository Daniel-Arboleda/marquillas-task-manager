import PropTypes from "prop-types";
import TaskEditorView from "../views/TaskEditorView";

export default function TaskDrawer({
    open,
    mode,
    task,
    errors,
    submitting,
    users,
    usersLoading,
    onChange,
    onSubmit,
    onClose,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="task-drawer">
            <div className="task-drawer__header">
                <h2 className="task-drawer__title">
                    {mode === "edit" ? "Edit Task" : "New Task"}
                </h2>
                <button
                    type="button"
                    className="task-drawer__close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="task-drawer__body">
                <TaskEditorView
                    mode={mode}
                    task={task}
                    errors={errors}
                    submitting={submitting}
                    users={users}
                    usersLoading={usersLoading}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}

TaskDrawer.propTypes = {
    errors: PropTypes.shape({
        description: PropTypes.shape({
            message: PropTypes.string,
            valid: PropTypes.bool,
        }),
        dueDate: PropTypes.shape({
            message: PropTypes.string,
            valid: PropTypes.bool,
        }),
        title: PropTypes.shape({
            message: PropTypes.string,
            valid: PropTypes.bool,
        }),
    }).isRequired,
    mode: PropTypes.oneOf([
        "create",
        "edit",
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    task: PropTypes.shape({
        assignedUserId: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        description: PropTypes.string,
        dueDate: PropTypes.string,
        priority: PropTypes.string,
        status: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
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

TaskDrawer.defaultProps = {
    open: false,
    submitting: false,
    users: [],
    usersLoading: false,
};