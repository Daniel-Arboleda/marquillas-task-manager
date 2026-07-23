import PropTypes from "prop-types";

export default function DeleteTaskDialog({
    open,
    task,
    submitting,
    onConfirm,
    onCancel,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="delete-task-dialog">
            <h3>Delete Task</h3>
            <p>
                Are you sure you want to delete{" "}
                <strong>{task?.title ?? "this task"}</strong>?
            </p>
            <div>
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onConfirm}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

DeleteTaskDialog.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    open: PropTypes.bool,
    submitting: PropTypes.bool,
    task: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        title: PropTypes.string,
    }),
};

DeleteTaskDialog.defaultProps = {
    open: false,
    submitting: false,
    task: null,
};