import { useCallback, useEffect, useState } from "react";
import {
    createTask,
    deleteTask,
    getTask,
    listTasks,
    updateTask,
} from "../api/taskApi";

export default function useTasks(initialFilters = {}) {
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({
        search: "",
        ...initialFilters,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listTasks(filters);
            setTasks(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    async function create(payload) {
        const task = await createTask(payload);
        await refresh();
        return task;
    }

    async function update(taskId, payload) {
        const task = await updateTask(taskId, payload);
        await refresh();
        return task;
    }

    async function remove(taskId) {
        await deleteTask(taskId);
        await refresh();
    }

    async function find(taskId) {
        return getTask(taskId);
    }

    return {
        tasks,
        loading,
        error,
        filters,
        setFilters,
        refresh,
        create,
        update,
        remove,
        find,
    };
}