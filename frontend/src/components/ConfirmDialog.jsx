import { useEffect, useRef } from "react";

export default function ConfirmDialog({
    open,
    title = "Confirmar acción",
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    submitting = false,
    onConfirm,
    onCancel,
}) {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        cancelButtonRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape" && !submitting) {
                onCancel?.();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, submitting, onCancel]);

    if (!open) {
        return null;
    }

    return (
        <div className="confirm-dialog-overlay" role="presentation">
            <div
                className="confirm-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
            >
                <h2 id="confirm-dialog-title">{title}</h2>
                <p id="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-actions">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={submitting}
                    >
                        {submitting ? "Procesando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}