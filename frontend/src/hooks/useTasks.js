import { useCallback, useEffect, useMemo, useState } from "react";
import {
    createTask,
    deleteTask,
    getTask,
    listTasks,
    updateTask,
} from "../api/taskApi";

const ALLOWED_FILTERS = [
    "search",
    "status",
    "priority",
    "assigned_user_id",
    "page",
    "page_size",
];

function sanitizeFilters(filters = {}) {
    return Object.fromEntries(
        ALLOWED_FILTERS.filter((key) =>
            filters[key] !== undefined &&
            filters[key] !== null &&
            filters[key] !== ""
        ).map((key) => [key, filters[key]])
    );
}

export default function useTasks(initialFilters = {}) {
    const initialState = {
        search: "",
        ...sanitizeFilters(initialFilters),
    };

    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState(initialState);
    const [queryFilters, setQueryFilters] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const requestFilters = useMemo(
        () => sanitizeFilters(queryFilters),
        [queryFilters]
    );

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listTasks(requestFilters);
            setTasks(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [requestFilters]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function create(payload) {
        setSubmitting(true);
        try {
            const task = await createTask(payload);
            await refresh();
            return task;
        } finally {
            setSubmitting(false);
        }
    }

    async function update(taskId, payload) {
        setSubmitting(true);
        try {
            const task = await updateTask(taskId, payload);
            await refresh();
            return task;
        } finally {
            setSubmitting(false);
        }
    }

    async function remove(taskId) {
        setSubmitting(true);
        try {
            await deleteTask(taskId);
            await refresh();
        } finally {
            setSubmitting(false);
        }
    }

    async function find(taskId) {
        return getTask(taskId);
    }

    return {
        tasks,
        loading,
        submitting,
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