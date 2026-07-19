import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTask, updateTask } from "../api/taskApi";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import TaskForm from "../components/TaskForm";
import useAuth from "../hooks/useAuth";
import useUsers from "../hooks/useUsers";

function normalizeDate(value) {
    return value ? new Date(value).toISOString() : null;
}

export default function EditTaskPage() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { users, loading: loadingUsers, error: usersError } = useUsers();

    const parsedTaskId = Number(taskId);
    const validTaskId = Number.isInteger(parsedTaskId) && parsedTaskId > 0;

    const [task, setTask] = useState(null);
    const [loadingTask, setLoadingTask] = useState(validTaskId);
    const [error, setError] = useState(validTaskId ? null : "Invalid task identifier.");
    const [submitting, setSubmitting] = useState(false);

    const allowAssignment = user?.role === "admin";

    const loadTask = useCallback(async () => {
        if (!validTaskId) {
            return;
        }

        setLoadingTask(true);
        setError(null);

        try {
            const response = await getTask(parsedTaskId);
            setTask(response);
        } catch (requestError) {
            setError(requestError.detail ?? requestError.message ?? "Unable to load task.");
        } finally {
            setLoadingTask(false);
        }
    }, [parsedTaskId, validTaskId]);

    useEffect(() => {
        loadTask();
    }, [loadTask]);

    async function handleSubmit(payload) {
        if (submitting || !task) {
            return;
        }

        const changes = {};

        if (payload.title !== task.title) {
            changes.title = payload.title;
        }

        if ((payload.description ?? null) !== (task.description ?? null)) {
            changes.description = payload.description;
        }

        if (payload.priority !== task.priority) {
            changes.priority = payload.priority;
        }

        if (payload.status !== task.status) {
            changes.status = payload.status;
        }

        if (allowAssignment) {
            if ((payload.assigned_user_id ?? null) !== (task.assigned_user_id ?? null)) {
                changes.assigned_user_id = payload.assigned_user_id;
            }
        }

        if (normalizeDate(payload.due_date) !== normalizeDate(task.due_date)) {
            changes.due_date = payload.due_date;
        }

        if (Object.keys(changes).length === 0) {
            navigate(`/app/tasks/${parsedTaskId}`, {
                replace: true,
            });
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await updateTask(parsedTaskId, changes);
            navigate(`/app/tasks/${parsedTaskId}`, {
                replace: true,
            });
        } catch (requestError) {
            setError(requestError);
        } finally {
            setSubmitting(false);
        }
    }

    if (loadingTask || loadingUsers) {
        return <LoadingState message="Loading task..." />;
    }

    if (usersError) {
        return (
            <ErrorState
                message={usersError.detail ?? usersError.message ?? "Unable to load users."}
            />
        );
    }

    if (!task) {
        return (
            <ErrorState
                message={typeof error === "string" ? error : error?.detail ?? error?.message}
            />
        );
    }

    return (
        <TaskForm
            initialValues={task}
            users={users}
            submitting={submitting}
            error={error}
            submitLabel="Save Changes"
            allowAssignment={allowAssignment}
            allowStatusChange
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/app/tasks/${parsedTaskId}`)}
        />
    );
}