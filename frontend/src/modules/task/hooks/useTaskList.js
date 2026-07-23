import { useCallback, useEffect, useState } from "react";
import { getTask, listTasks } from "../../../api/taskApi";
import { mapTaskFromApi, mapTaskListFromApi } from "../services/taskMapper";

export default function useTaskList(filters = {}) {
    const [tasks, setTasks] = useState({
        items: [],
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await listTasks(filters);
            const data = mapTaskListFromApi(response);
            setTasks(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const find = useCallback(async (taskId) => {
        const response = await getTask(taskId);
        return mapTaskFromApi(response);
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return {
        tasks,
        loading,
        error,
        refresh,
        find,
    };
}