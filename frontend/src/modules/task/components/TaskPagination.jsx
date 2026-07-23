import PropTypes from "prop-types";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function TaskPagination({
    page,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange,
}) {
    return (
        <div className="task-pagination">
            <div>
                <span>Total: {total}</span>
                <span>Page {page} of {totalPages}</span>
            </div>
            <div>
                <select
                    value={pageSize}
                    onChange={({ target }) => onPageSizeChange(Number(target.value))}
                >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Previous
                </button>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

TaskPagination.propTypes = {
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    totalPages: PropTypes.number,
};

TaskPagination.defaultProps = {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
};