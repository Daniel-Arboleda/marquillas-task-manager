const formatDate = (value) => {
    if (!value) {
        return "";
    }
    return String(value).split("T")[0];
};

export const normalizeTask = (task = {}) => ({
    ...task,
    assignedUserId: task.assignedUserId ?? task.assigned_user_id ?? "",
    assignedUserName: task.assignedUserName ?? task.assigned_user_name ?? "",
    assignedUserEmail: task.assignedUserEmail ?? task.assigned_user_email ?? "",
    isOverdue: task.isOverdue ?? task.is_overdue ?? false,
    daysOverdue: task.daysOverdue ?? task.days_overdue ?? 0,
    createdAt: task.createdAt ?? task.created_at ?? null,
    updatedAt: task.updatedAt ?? task.updated_at ?? null,
    dueDate: formatDate(task.dueDate ?? task.due_date),
});

export const mapTaskFromApi = (task = {}) => normalizeTask({
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    assignedUserId: task.assigned_user_id,
    assignedUserName: task.assigned_user_name,
    assignedUserEmail: task.assigned_user_email,
    isOverdue: task.is_overdue,
    daysOverdue: task.days_overdue,
    dueDate: task.due_date,
    createdBy: task.created_by,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
});

export const mapTaskListFromApi = (response = {}) => ({
    ...response,
    items: Array.isArray(response.items)
        ? response.items.map(mapTaskFromApi)
        : [],
});

export const mapTaskToCreatePayload = (form = {}) => ({
    title: form.title?.trim() || "",
    description: form.description?.trim() || null,
    priority: form.priority,
    assigned_user_id: form.assignedUserId || null,
    due_date: form.dueDate || null,
});

export const mapTaskToUpdatePayload = (form = {}) => ({
    title: form.title?.trim() || "",
    description: form.description?.trim() || null,
    status: form.status,
    priority: form.priority,
    assigned_user_id: form.assignedUserId || null,
    due_date: form.dueDate || null,
});