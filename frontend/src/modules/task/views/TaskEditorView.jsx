import PropTypes from "prop-types";
import TaskForm from "../components/TaskForm";

export default function TaskEditorView({
    mode,
    task,
    errors,
    submitting,
    users,
    usersLoading,
    onChange,
    onSubmit,
    onCancel,
}) {
    return (
        <TaskForm
            mode={mode}
            values={task}
            errors={errors}
            submitting={submitting}
            users={users}
            usersLoading={usersLoading}
            onChange={onChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
}

TaskEditorView.propTypes = {
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
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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

TaskEditorView.defaultProps = {
    submitting: false,
    users: [],
    usersLoading: false,
};