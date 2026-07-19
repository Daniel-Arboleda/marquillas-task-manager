import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import Pagination from "../components/Pagination";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import useDebounce from "../hooks/useDebounce";
import useTasks from "../hooks/useTasks";

export default function TasksPage() {
    const navigate = useNavigate();
    const {
        tasks,
        loading,
        error,
        filters,
        setFilters,
        queryFilters,
        setQueryFilters,
    } = useTasks({
        page: 1,
        page_size: 20,
    });
    const [selectedRows, setSelectedRows] = useState([]);
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

    const rows = Array.isArray(tasks?.items) ? tasks.items : [];
    const totalPages = tasks?.total_pages ?? 1;

    function handleFiltersChange(nextFilters) {
        setSelectedRows([]);
        setFilters({
            ...nextFilters,
            page: 1,
        });
    }

    function handleCreate() {
        navigate("/app/tasks/new");
    }

    function handleView(taskId) {
        navigate(`/app/tasks/${taskId}`);
    }

    function handleEdit(taskId) {
        navigate(`/app/tasks/${taskId}/edit`);
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
                onCreate={handleCreate}
            />
            {loading ? (
                <LoadingState message="Loading tasks..." />
            ) : error ? (
                <ErrorState message={error.detail ?? "Unable to load tasks."} />
            ) : rows.length === 0 ? (
                <EmptyState message="No tasks found." />
            ) : (
                <>
                    <TaskTable
                        tasks={rows}
                        selectedRows={selectedRows}
                        onSelectionChange={setSelectedRows}
                        onView={handleView}
                        onEdit={handleEdit}
                    />
                    <Pagination
                        page={filters.page}
                        totalPages={totalPages}
                        onPrevious={previousPage}
                        onNext={nextPage}
                    />
                </>
            )}
        </section>
    );
}