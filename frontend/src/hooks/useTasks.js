import { useCallback, useEffect, useState } from "react";
import {
    createTask,
    deleteTask,
    getTask,
    listTasks,
    updateTask,
} from "../api/taskApi";

export default function useTasks(initialFilters = {}) {
    const initialState = {
        search: "",
        ...initialFilters,
    };

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState(initialState);
    const [queryFilters, setQueryFilters] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listTasks(queryFilters);
            setTasks(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [queryFilters]);

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
        queryFilters,
        setQueryFilters,
        refresh,
        create,
        update,
        remove,
        find,
    };
}