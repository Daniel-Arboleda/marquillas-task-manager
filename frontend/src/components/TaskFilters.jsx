export default function TaskFilters({
    filters,
    onChange,
    selectedCount = 0,
    onCreate,
}) {
    function handleChange(event) {
        const { name, value } = event.target;
        onChange({
            ...filters,
            [name]: value,
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
                value={filters.search ?? ""}
                onChange={handleChange}
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