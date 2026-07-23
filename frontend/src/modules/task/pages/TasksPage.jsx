import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "../../../hooks/useUsers";
import DeleteTaskDialog from "../components/DeleteTaskDialog";
import TaskPagination from "../components/TaskPagination";
import TaskSummary from "../components/TaskSummary";
import TaskTable from "../components/TaskTable";
import TaskToolbar from "../components/TaskToolbar";
import useTaskCrud from "../hooks/useTaskCrud";
import useTaskDelete from "../hooks/useTaskDelete";
import useTaskFilters from "../hooks/useTaskFilters";
import useTaskList from "../hooks/useTaskList";
import useTaskSelection from "../hooks/useTaskSelection";

export default function TasksPage() {
    const navigate = useNavigate();
    const filters = useTaskFilters();
    const list = useTaskList(filters.filters);
    const crud = useTaskCrud(list.refresh);
    const selection = useTaskSelection();
    const deletion = useTaskDelete(crud);
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

    const handleCreate = useCallback(() => {
        navigate("/app/tasks/new");
    }, [navigate]);

    const handleEdit = useCallback((task) => {
        navigate(`/app/tasks/${task.id}`);
    }, [navigate]);

    const onAssignmentChange = useCallback(async (task, assignedUserId) => {
        await crud.update(task.id, {
            ...task,
            assignedUserId: assignedUserId || "",
        });
    }, [crud]);

    return (
        <>
            <TaskToolbar
                filters={filters.filters}
                users={assignmentOptions}
                usersLoading={usersLoading}
                onSearch={filters.setSearch}
                onStatusChange={filters.setStatus}
                onPriorityChange={filters.setPriority}
                onAssignedUserChange={filters.setAssignedUser}
                onClear={filters.clear}
                onCreate={handleCreate}
            />
            <TaskSummary
                tasks={list.tasks}
                loading={list.loading}
            />
            <TaskTable
                tasks={list.tasks}
                loading={list.loading}
                selectedIds={selection.selectedIds}
                onToggleSelection={selection.toggle}
                onSelectAll={selection.selectAll}
                onEdit={handleEdit}
                onDelete={deletion.request}
                isSelected={selection.isSelected}
                users={assignmentOptions}
                usersLoading={usersLoading}
                onAssignmentChange={onAssignmentChange}
            />
            <TaskPagination
                page={filters.filters.page}
                pageSize={filters.filters.pageSize}
                total={list.tasks.total}
                totalPages={list.tasks.totalPages}
                onPageChange={filters.setPage}
                onPageSizeChange={filters.setPageSize}
            />
            <DeleteTaskDialog
                open={deletion.open}
                task={deletion.task}
                submitting={deletion.submitting}
                onConfirm={deletion.confirm}
                onCancel={deletion.close}
            />
        </>
    );
}