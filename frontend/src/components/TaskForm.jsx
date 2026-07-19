import { useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
];

function toLocalDateTime(value) {
    if (!value) {
        return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function TaskForm({
    initialValues = {},
    users = [],
    submitting = false,
    error = null,
    submitLabel = "Save",
    allowAssignment = true,
    allowStatusChange = true,
    onSubmit,
    onCancel,
}) {
    const [title, setTitle] = useState(initialValues.title ?? "");
    const [description, setDescription] = useState(initialValues.description ?? "");
    const [status, setStatus] = useState(initialValues.status ?? "pending");
    const [priority, setPriority] = useState(initialValues.priority ?? "medium");
    const [assignedUserId, setAssignedUserId] = useState(
        initialValues.assigned_user_id == null ? "" : String(initialValues.assigned_user_id),
    );
    const [dueDate, setDueDate] = useState(toLocalDateTime(initialValues.due_date));

    useEffect(() => {
        setTitle(initialValues.title ?? "");
        setDescription(initialValues.description ?? "");
        setStatus(initialValues.status ?? "pending");
        setPriority(initialValues.priority ?? "medium");
        setAssignedUserId(
            initialValues.assigned_user_id == null ? "" : String(initialValues.assigned_user_id),
        );
        setDueDate(toLocalDateTime(initialValues.due_date));
    }, [initialValues]);

    const validationError = useMemo(() => {
        if (!title.trim()) {
            return "Title is required.";
        }
        if (title.trim().length > 200) {
            return "Title cannot exceed 200 characters.";
        }
        if (description.length > 5000) {
            return "Description cannot exceed 5000 characters.";
        }
        if (dueDate) {
            const selectedDate = new Date(dueDate);
            if (Number.isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
                return "Due date must be in the future.";
            }
        }
        return null;
    }, [title, description, dueDate]);

    function handleSubmit(event) {
        event.preventDefault();

        if (validationError || submitting) {
            return;
        }

        const payload = {
            title: title.trim(),
            description: description.trim() || null,
            priority,
        };

        if (allowStatusChange) {
            payload.status = status;
        }

        if (allowAssignment) {
            payload.assigned_user_id = assignedUserId === "" ? null : Number(assignedUserId);
        }

        if (dueDate) {
            payload.due_date = new Date(dueDate).toISOString();
        }

        onSubmit?.(payload);
    }

    return (
        <form onSubmit={handleSubmit}>
            {(validationError || error) && (
                <div>{validationError ?? error?.detail ?? error?.message ?? String(error)}</div>
            )}

            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    maxLength={200}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    maxLength={5000}
                    onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            {allowStatusChange && (
                <div>
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="priority">Priority</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                >
                    {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {allowAssignment && (
                <div>
                    <label htmlFor="assigned_user_id">Assigned User</label>
                    <select
                        id="assigned_user_id"
                        value={assignedUserId}
                        onChange={(event) => setAssignedUserId(event.target.value)}
                    >
                        <option value="">Unassigned</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="due_date">Due Date</label>
                <input
                    id="due_date"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                />
            </div>

            <div>
                <button type="submit" disabled={submitting || Boolean(validationError)}>
                    {submitLabel}
                </button>

                {onCancel && (
                    <button type="button" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}