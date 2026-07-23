import { useCallback, useState } from "react";

export default function useTaskDelete(crud) {
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState(null);

    const request = useCallback((task) => {
        setTask(task);
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        setTask(null);
    }, []);

    const confirm = useCallback(async () => {
        if (!task?.id) {
            return;
        }
        await crud.remove(task.id);
        close();
    }, [
        crud,
        task,
        close,
    ]);

    return {
        open,
        task,
        submitting: crud.submitting,
        request,
        close,
        confirm,
    };
}