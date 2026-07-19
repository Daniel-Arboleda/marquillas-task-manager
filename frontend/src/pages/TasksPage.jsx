import { useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import Pagination from "../components/Pagination";
import TaskFilters from "../components/TaskFilters";
import TaskTable from "../components/TaskTable";
import useTasks from "../hooks/useTasks";

export default function TasksPage() {
    const {
        tasks,
        loading,
        error,
        filters,
        setFilters,
    } = useTasks({
        page: 1,
        page_size: 20,
    });

    const [selectedRows, setSelectedRows] = useState([]);

    const rows = Array.isArray(tasks?.items) ? tasks.items : [];
    const totalPages = tasks?.total_pages ?? 1;

    function handleCreate() {}

    function handleBulkAssign() {}

    function handleBulkComplete() {}

    function handleBulkDelete() {}

    function previousPage() {
        if (filters.page <= 1) {
            return;
        }

        setFilters({
            ...filters,
            page: filters.page - 1,
        });
    }

    function nextPage() {
        if (filters.page >= totalPages) {
            return;
        }

        setFilters({
            ...filters,
            page: filters.page + 1,
        });
    }

    return (
        <section className="tasks-page">
            <TaskFilters
                filters={filters}
                onChange={setFilters}
                selectedCount={selectedRows.length}
                onCreate={handleCreate}
                onBulkAssign={handleBulkAssign}
                onBulkComplete={handleBulkComplete}
                onBulkDelete={handleBulkDelete}
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