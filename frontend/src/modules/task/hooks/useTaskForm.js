import { useCallback, useMemo, useState } from "react";
import { hasErrors, validateTask } from "../services/taskValidation";

const DEFAULT_ERRORS = {
    title: {
        valid: true,
        message: "",
    },
    description: {
        valid: true,
        message: "",
    },
    dueDate: {
        valid: true,
        message: "",
    },
};

export default function useTaskForm({
    drawer,
    crud,
}) {
    const [errors, setErrors] = useState(DEFAULT_ERRORS);

    const task = useMemo(() => drawer.task, [drawer.task]);

    const onChange = useCallback((field, value) => {
        drawer.setTask((current) => ({
            ...current,
            [field]: value,
        }));
    }, [drawer.setTask]);

    const reset = useCallback(() => {
        setErrors(DEFAULT_ERRORS);
    }, []);

    const onSubmit = useCallback(async (event) => {
        event.preventDefault();

        const validation = validateTask(drawer.task);

        setErrors(validation.errors);

        if (hasErrors(validation.errors)) {
            return;
        }

        if (drawer.mode === "edit") {
            await crud.update(
                drawer.task.id,
                drawer.task,
            );
        } else {
            await crud.create(drawer.task);
        }

        reset();
        drawer.close();
    }, [
        crud,
        drawer.mode,
        drawer.task,
        drawer.close,
        reset,
    ]);

    return {
        task,
        errors,
        submitting: crud.submitting,
        onChange,
        onSubmit,
        reset,
    };
}