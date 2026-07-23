const success = { valid: true, message: "" };

const failure = (message) => ({
    valid: false,
    message,
});

export const validateTitle = (value) => {
    const title = value?.trim() ?? "";
    if (!title) {
        return failure("Title is required.");
    }
    if (title.length > 200) {
        return failure("Title must not exceed 200 characters.");
    }
    return success;
};

export const validateDescription = (value) => {
    if ((value?.length ?? 0) > 5000) {
        return failure("Description must not exceed 5000 characters.");
    }
    return success;
};

export const validateDueDate = (value) => {
    if (!value) {
        return success;
    }
    return Number.isNaN(Date.parse(value))
        ? failure("Due date is invalid.")
        : success;
};

export const validateTask = (task = {}) => {
    const errors = {
        title: validateTitle(task.title),
        description: validateDescription(task.description),
        dueDate: validateDueDate(task.dueDate),
    };
    return {
        valid: !hasErrors(errors),
        errors,
    };
};

export const hasErrors = (errors = {}) =>
    Object.values(errors).some(({ valid }) => !valid);