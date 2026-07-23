import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import TaskDrawer from "../components/TaskDrawer";
import TaskHistory from "../components/TaskHistory";
import usePermissions from "../hooks/usePermissions";
import useTask from "../hooks/useTask";
import useUsers from "../hooks/useUsers";

function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleString();
}

export default function TaskDetailPage() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const {
        task,
        history,
        loading,
        historyLoading,
        error,
        historyError,
        submitting,
        refresh,
        update,
        remove,
    } = useTask(taskId);

    const permissions = usePermissions("tasks", task);

    const {
        users,
    } = useUsers(permissions.assign);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    async function handleSubmit(payload) {
        return update(payload);
    }

    async function handleDelete() {
        await remove();
        navigate("/app/tasks");
    }

    if (loading) {
        return <LoadingState message="Loading task..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error.detail ?? error.message ?? "Unable to load task."}
            />
        );
    }

    if (!task) {
        return <EmptyState message="Task not found." />;
    }

    return (
        <section className="task-detail-page">
            <header className="task-detail-header">
                <div>
                    <h1>{task.title}</h1>
                    <div className="task-detail-badges">
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                    </div>
                </div>

                <div className="task-detail-actions">
                    {permissions.edit && (
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(true)}
                        >
                            Edit
                        </button>
                    )}

                    {permissions.delete && (
                        <button
                            type="button"
                            onClick={() => setConfirmOpen(true)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </header>

            <section className="task-detail-summary">
                <dl>
                    <dt>Description</dt>
                    <dd>{task.description ?? "-"}</dd>

                    <dt>Assigned</dt>
                    <dd>{task.assigned_user_name ?? task.assigned_user_id ?? "-"}</dd>

                    <dt>Due Date</dt>
                    <dd>{formatDate(task.due_date)}</dd>

                    <dt>Created</dt>
                    <dd>{formatDate(task.created_at)}</dd>

                    <dt>Updated</dt>
                    <dd>{formatDate(task.updated_at)}</dd>
                </dl>
            </section>

            <section className="task-detail-history">
                <h2>History</h2>

                {historyLoading ? (
                    <LoadingState message="Loading history..." />
                ) : historyError ? (
                    <ErrorState
                        message={
                            historyError.detail ??
                            historyError.message ??
                            "Unable to load history."
                        }
                    />
                ) : (
                    <TaskHistory history={history} />
                )}
            </section>

            <TaskDrawer
                open={drawerOpen}
                mode="edit"
                task={task}
                users={users}
                submitting={submitting}
                error={error}
                allowAssignment={permissions.assign}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                onSuccess={() => {
                    setDrawerOpen(false);
                    refresh();
                }}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Delete task"
                message="Are you sure you want to delete this task?"
                submitting={submitting}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </section>
    );
}