import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import Pagination from "../components/Pagination";
import TaskDrawer from "../components/TaskDrawer";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import useDebounce from "../hooks/useDebounce";
import usePermissions from "../hooks/usePermissions";
import useTasks from "../hooks/useTasks";
import useUsers from "../hooks/useUsers";

export default function TasksPage() {
    const navigate = useNavigate();
    const {
        tasks,
        loading,
        submitting,
        error,
        filters,
        setFilters,
        queryFilters,
        setQueryFilters,
        create,
        update,
        remove,
        find,
    } = useTasks({
        page: 1,
        page_size: 20,
    });

    const permissions = usePermissions("tasks");
    const { users } = useUsers(permissions.assign);
    const [selectedRows, setSelectedRows] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState("create");
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const debouncedSearch = useDebounce(filters.search, 300);

    useEffect(() => {
        if (
            debouncedSearch !== queryFilters.search ||
            filters.status !== queryFilters.status ||
            filters.priority !== queryFilters.priority ||
            filters.page !== queryFilters.page ||
            filters.page_size !== queryFilters.page_size
        ) {
            setQueryFilters({
                ...filters,
                search: debouncedSearch,
            });
        }
    }, [
        debouncedSearch,
        filters.status,
        filters.priority,
        filters.page,
        filters.page_size,
        queryFilters.search,
        queryFilters.status,
        queryFilters.priority,
        queryFilters.page,
        queryFilters.page_size,
        setQueryFilters,
    ]);

    const rows = tasks?.items ?? [];
    const totalPages = tasks?.total_pages ?? 1;

    function handleFiltersChange(nextFilters) {
        setSelectedRows([]);
        setFilters({
            ...nextFilters,
            page: 1,
        });
    }

    function handleCreate() {
        setActiveTaskId(null);
        setActiveTask(null);
        setActionError(null);
        setDrawerMode("create");
        setDrawerOpen(true);
    }

    function handleView(taskId) {
        navigate(`/app/tasks/${taskId}`);
    }

    async function handleEdit(taskId) {
        setActionError(null);

        try {
            const task = await find(taskId);
            setActiveTaskId(taskId);
            setActiveTask(task);
            setDrawerMode("edit");
            setDrawerOpen(true);
        } catch (err) {
            setActionError(err);
        }
    }

    function handleDelete(taskId) {
        setActiveTaskId(taskId);
        setActionError(null);
        setConfirmOpen(true);
    }

    function handleDrawerClose() {
        setDrawerOpen(false);
        setActiveTaskId(null);
        setActiveTask(null);
        setActionError(null);
    }

    async function handleDrawerSubmit(payload) {
        setActionError(null);

        try {
            return drawerMode === "edit"
                ? await update(activeTaskId, payload)
                : await create(payload);
        } catch (err) {
            setActionError(err);
            throw err;
        }
    }

    function handleDrawerSuccess() {
        handleDrawerClose();
        setSelectedRows([]);
    }

    function handleConfirmClose() {
        setConfirmOpen(false);
        setActiveTaskId(null);
        setActionError(null);
    }

    async function handleDeleteConfirm() {
        setActionError(null);

        try {
            await remove(activeTaskId);
            handleConfirmClose();
            setSelectedRows([]);
        } catch (err) {
            setActionError(err);
            throw err;
        }
    }

    function previousPage() {
        if (filters.page <= 1) {
            return;
        }

        setSelectedRows([]);
        setFilters({
            ...filters,
            page: filters.page - 1,
        });
    }

    function nextPage() {
        if (filters.page >= totalPages) {
            return;
        }

        setSelectedRows([]);
        setFilters({
            ...filters,
            page: filters.page + 1,
        });
    }

    return (
        <section className="tasks-page">
            <TaskFilters
                filters={filters}
                onChange={handleFiltersChange}
                selectedCount={selectedRows.length}
                onCreate={permissions.create ? handleCreate : undefined}
            />

            {actionError && !drawerOpen && !confirmOpen ? (
                <ErrorState
                    message={
                        actionError.detail ??
                        actionError.message ??
                        "Unable to process the task."
                    }
                />
            ) : loading ? (
                <LoadingState message="Loading tasks..." />
            ) : error ? (
                <ErrorState
                    message={error.detail ?? error.message ?? "Unable to load tasks."}
                />
            ) : rows.length === 0 ? (
                <EmptyState message="No tasks found." />
            ) : (
                <>
                    <TaskTable
                        tasks={rows}
                        permissions={permissions}
                        selectedRows={selectedRows}
                        onSelectionChange={setSelectedRows}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        page={filters.page}
                        totalPages={totalPages}
                        onPrevious={previousPage}
                        onNext={nextPage}
                    />
                </>
            )}

            <TaskDrawer
                open={drawerOpen}
                mode={drawerMode}
                task={activeTask}
                users={users}
                submitting={submitting}
                error={actionError}
                allowAssignment={permissions.assign}
                onClose={handleDrawerClose}
                onSubmit={handleDrawerSubmit}
                onSuccess={handleDrawerSuccess}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Delete task"
                message="Are you sure you want to delete this task?"
                submitting={submitting}
                error={actionError}
                onCancel={handleConfirmClose}
                onConfirm={handleDeleteConfirm}
            />
        </section>
    );
}