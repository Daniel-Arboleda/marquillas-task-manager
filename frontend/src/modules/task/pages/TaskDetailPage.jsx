import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUsers from "../../../hooks/useUsers";
import useTaskEdit from "../hooks/useTaskEdit";
import { hasErrors, validateTask } from "../services/taskValidation";
import TaskEditorView from "../views/TaskEditorView";

const DEFAULT_ERRORS = {
    title: {
        valid: true,
        message: "",
    },
    description: {
        valid: true,
        message: "",
    },
    dueDate: {
        valid: true,
        message: "",
    },
};

export default function TaskDetailPage() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(DEFAULT_ERRORS);
    const {
        task,
        loading,
        submitting,
        error,
        onChange,
        save,
    } = useTaskEdit(taskId);
    const {
        users,
        loading: usersLoading,
    } = useUsers();

    const assignmentOptions = useMemo(
        () => users.map((user) => ({
            id: user.id,
            name: user.name,
        })),
        [users],
    );

    const close = useCallback(() => {
        navigate("/app/tasks");
    }, [navigate]);

    const onSubmit = useCallback(async (event) => {
        event.preventDefault();

        const validation = validateTask(task);
        setErrors(validation.errors);

        if (hasErrors(validation.errors)) {
            return;
        }

        try {
            await save(task);
            navigate("/app/tasks");
        } catch {
            return;
        }
    }, [
        task,
        save,
        navigate,
    ]);

    if (loading) {
        return (
            <div className="task-editor-state">
                Loading task...
            </div>
        );
    }

    if (error && !task.id) {
        return (
            <div
                className="task-editor-state task-editor-state--error"
                role="alert"
            >
                {error.detail || "Unable to load the task."}
            </div>
        );
    }

    return (
        <>
            {error && (
                <div
                    className="task-editor-state task-editor-state--error"
                    role="alert"
                >
                    {error.detail || "Unable to update the task."}
                </div>
            )}
            <TaskEditorView
                mode="edit"
                task={task}
                errors={errors}
                submitting={submitting}
                users={assignmentOptions}
                usersLoading={usersLoading}
                onChange={onChange}
                onSubmit={onSubmit}
                onCancel={close}
            />
        </>
    );
}