import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export default function TaskFilters({
    filters,
    onChange,
    selectedCount = 0,
    onCreate,
}) {
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        setSearch(filters.search ?? "");
    }, [filters.search]);

    useEffect(() => {
        if (debouncedSearch === (filters.search ?? "")) {
            return;
        }

        onChange({
            ...filters,
            search: debouncedSearch,
            page: 1,
        });
    }, [debouncedSearch, filters, onChange]);

    function handleChange(event) {
        const { name, value } = event.target;

        onChange({
            ...filters,
            [name]: value || null,
            page: 1,
        });
    }

    function handleClear() {
        setSearch("");
        onChange({
            ...filters,
            search: null,
            status: null,
            priority: null,
            page: 1,
        });
    }

    return (
        <section className="task-filters" role="toolbar" aria-label="Task filters">
            <button
                type="button"
                onClick={onCreate}
            >
                New Task
            </button>

            <input
                type="search"
                name="search"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <select
                name="status"
                value={filters.status ?? ""}
                onChange={handleChange}
            >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>

            <select
                name="priority"
                value={filters.priority ?? ""}
                onChange={handleChange}
            >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
            </select>

            <button
                type="button"
                onClick={handleClear}
            >
                Clear
            </button>

            {selectedCount > 0 && (
                <div className="task-bulk-actions">
                    <span className="task-selection-count">
                        {selectedCount} selected
                    </span>
                </div>
            )}
        </section>
    );
}