import { useEffect, useRef } from "react";
import TaskForm from "./TaskForm";

export default function TaskDrawer({
    open,
    mode = "create",
    task = null,
    users = [],
    submitting = false,
    error = null,
    allowAssignment = true,
    onClose,
    onSubmit,
    onSuccess,
}) {
    const drawerRef = useRef(null);

    useEffect(() => {

        console.log(open);
        
        if (!open) {
            return;
        }

        drawerRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape" && !submitting) {
                onClose?.();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, submitting, onClose]);

    console.log(open);

    if (!open) {
        return null;
    }

    async function handleSubmit(payload) {
        const response = await onSubmit?.(payload);
        onSuccess?.(response);
        return response;
    }

    return (
        <div className="task-drawer-overlay" role="presentation">
            <aside
                ref={drawerRef}
                className="task-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="task-drawer-title"
                tabIndex={-1}
            >
                <header className="task-drawer-header">
                    <h2 id="task-drawer-title">
                        {mode === "edit" ? "Editar tarea" : "Nueva tarea"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </header>

                <TaskForm
                    initialValues={task ?? {}}
                    users={users}
                    submitting={submitting}
                    error={error}
                    submitLabel={mode === "edit" ? "Save Changes" : "Create Task"}
                    allowAssignment={allowAssignment}
                    allowStatusChange={mode === "edit"}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </aside>
        </div>
    );
}