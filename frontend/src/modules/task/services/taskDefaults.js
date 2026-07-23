export const TASK_STATUS = [
    "pending",
    "in_progress",
    "completed",
    "cancelled",
];

export const TASK_PRIORITY = [
    "low",
    "medium",
    "high",
    "critical",
];

export const DEFAULT_TASK_FORM = {
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedUserId: "",
    dueDate: "",
};

export const DEFAULT_TASK_FILTERS = {
    search: "",
    status: "",
    priority: "",
    assignedUserId: "",
};

export const DEFAULT_PAGINATION = {
    page: 1,
    pageSize: 20,
};

export const EMPTY_TASK = {
    id: null,
    ...DEFAULT_TASK_FORM,
    createdAt: null,
    updatedAt: null,
};