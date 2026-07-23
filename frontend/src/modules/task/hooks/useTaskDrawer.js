import { useCallback, useState } from "react";
import { EMPTY_TASK } from "../services/taskDefaults";

export default function useTaskDrawer() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("create");
    const [task, setTask] = useState(EMPTY_TASK);

    const reset = useCallback(() => {
        setMode("create");
        setTask(EMPTY_TASK);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        reset();
    }, [reset]);

    const openCreate = useCallback(() => {
        reset();
        setOpen(true);
    }, [reset]);

    const openEdit = useCallback((task) => {
        setMode("edit");
        setTask(task ?? EMPTY_TASK);
        setOpen(true);
    }, []);

    return {
        open,
        mode,
        task,
        setTask,
        openCreate,
        openEdit,
        close,
        reset,
    };
}