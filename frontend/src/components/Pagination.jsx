export default function Pagination({
    page,
    totalPages,
    onPrevious,
    onNext,
}) {
    return (
        <nav className="pagination">
            <button
                type="button"
                onClick={onPrevious}
                disabled={page <= 1}
            >
                Previous
            </button>
            <span>
                {page} / {totalPages}
            </span>
            <button
                type="button"
                onClick={onNext}
                disabled={page >= totalPages}
            >
                Next
            </button>
        </nav>
    );
}