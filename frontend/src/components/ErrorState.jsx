export default function ErrorState({ message = "An unexpected error occurred." }) {
    return (
        <div className="error-state">
            {message}
        </div>
    );
}