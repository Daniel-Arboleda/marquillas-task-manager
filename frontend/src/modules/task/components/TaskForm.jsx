import PropTypes from "prop-types";
import { TASK_PRIORITY, TASK_STATUS } from "../services/taskDefaults";

export default function TaskForm({
    mode,
    values,
    errors,
    submitting,
    users,
    usersLoading,
    onChange,
    onSubmit,
    onCancel,
}) {
    console.log("TASK FORM VALUES", values);

    return (
        <form
            className="task-form"
            onSubmit={onSubmit}
        >
            <div className="task-form__group">
                <label
                    className="task-form__label"
                    htmlFor="title"
                >
                    Title
                </label>
                <input
                    className="task-form__control"
                    id="title"
                    name="title"
                    type="text"
                    value={values.title}
                    onChange={({ target }) => onChange(target.name, target.value)}
                />
                {!errors.title?.valid && (
                    <span className="task-form__error">
                        {errors.title.message}
                    </span>
                )}
            </div>

            <div className="task-form__group">
                <label
                    className="task-form__label"
                    htmlFor="description"
                >
                    Description
                </label>
                <textarea
                    className="task-form__control task-form__textarea"
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={({ target }) => onChange(target.name, target.value)}
                />
                {!errors.description?.valid && (
                    <span className="task-form__error">
                        {errors.description.message}
                    </span>
                )}
            </div>

            <div className="task-form__group">
                <label
                    className="task-form__label"
                    htmlFor="priority"
                >
                    Priority
                </label>
                <select
                    className="task-form__control"
                    id="priority"
                    name="priority"
                    value={values.priority}
                    onChange={({ target }) => onChange(target.name, target.value)}
                >
                    {TASK_PRIORITY.map((priority) => (
                        <option
                            key={priority}
                            value={priority}
                        >
                            {priority}
                        </option>
                    ))}
                </select>
            </div>

            <div className="task-form__group">
                <label
                    className="task-form__label"
                    htmlFor="status"
                >
                    Status
                </label>
                <select
                    className="task-form__control"
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={({ target }) => onChange(target.name, target.value)}
                >
                    {TASK_STATUS.map((status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="task-form__group">
                <label
                    className="task-form__label"
                    htmlFor="assignedUserId"
                >
                    Assigned User
                </label>
                <select
                    className="task-form__control"
                    id="assignedUserId"
                    name="assignedUserId"
                    value={values.assignedUserId || ""}
                    disabled={usersLoading}
                    onChange={({ target }) => onChange(target.name, target.value)}
                >
                    <option value="">
                        Unassigned
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

            <div className="task-form__group">
                <label
                    className="task-form__label"
                    htmlFor="dueDate"
                >
                    Due Date
                </label>
                <input
                    className="task-form__control"
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={values.dueDate}
                    onChange={({ target }) => onChange(target.name, target.value)}
                />
                {!errors.dueDate?.valid && (
                    <span className="task-form__error">
                        {errors.dueDate.message}
                    </span>
                )}
            </div>

            <div className="task-form__actions">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                >
                    {mode === "edit" ? "Update Task" : "Create Task"}
                </button>
            </div>
        </form>
    );
}

TaskForm.propTypes = {
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
    mode: PropTypes.oneOf(["create", "edit"]).isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
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
    values: PropTypes.shape({
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
};

TaskForm.defaultProps = {
    submitting: false,
    users: [],
    usersLoading: false,
};