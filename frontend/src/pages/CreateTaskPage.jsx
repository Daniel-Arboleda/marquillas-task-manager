import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTask } from "../api/taskApi";
import TaskForm from "../components/TaskForm";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useUsers from "../hooks/useUsers";

export default function CreateTaskPage() {
    const navigate = useNavigate();
    const { users, loading, error: usersError } = useUsers();

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    async function handleSubmit(payload) {
        if (submitting) {
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            const task = await createTask(payload);
            navigate(`/app/tasks/${task.id}`, { replace: true });
        } catch (error) {
            setSubmitError(error);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <LoadingState message="Loading users..." />;
    }

    if (usersError) {
        return <ErrorState error={usersError} />;
    }

    return (
        <TaskForm
            initialValues={{}}
            users={users}
            submitting={submitting}
            error={submitError}
            submitLabel="Create Task"
            allowAssignment
            allowStatusChange={false}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
        />
    );
}