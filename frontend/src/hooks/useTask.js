import { useCallback, useEffect, useState } from "react";
import {
    deleteTask,
    getTask,
    getTaskHistory,
    updateTask,
} from "../api/taskApi";

export default function useTask(taskId) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    const refresh = useCallback(async () => {
        if (!taskId) {
            setTask(null);
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await getTask(taskId);
            setTask(response);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    const refreshHistory = useCallback(async () => {
        if (!taskId) {
            setHistory([]);
            return [];
        }

        setHistoryLoading(true);
        setHistoryError(null);

        try {
            const response = await getTaskHistory(taskId);
            const items = Array.isArray(response) ? response : response?.items ?? [];
            setHistory(items);
            return items;
        } catch (err) {
            setHistoryError(err);
            throw err;
        } finally {
            setHistoryLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        refresh();
        refreshHistory();
    }, [refresh, refreshHistory]);

    async function update(payload) {
        const response = await updateTask(taskId, payload);
        await refresh();
        await refreshHistory();
        return response;
    }

    async function remove() {
        await deleteTask(taskId);
        setTask(null);
        setHistory([]);
        setError(null);
        setHistoryError(null);
    }

    return {
        task,
        loading,
        error,
        refresh,
        update,
        remove,
        history,
        historyLoading,
        historyError,
    };
}