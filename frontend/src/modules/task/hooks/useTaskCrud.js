import { useCallback, useState } from "react";
import { createTask, deleteTask, updateTask, updateTaskStatus } from "../../../api/taskApi";
import {
    mapTaskToCreatePayload,
    mapTaskToUpdatePayload,
} from "../services/taskMapper";

export default function useTaskCrud(refresh = async () => {}) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const create = useCallback(async (task) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await createTask(
                mapTaskToCreatePayload(task),
            );
            await refresh();
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [refresh]);

    const update = useCallback(async (taskId, task) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await updateTask(
                taskId,
                mapTaskToUpdatePayload(task),
            );
            await refresh();
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [refresh]);

    const updateStatus = useCallback(async (taskId, status) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await updateTaskStatus(
                taskId,
                { status },
            );
            await refresh();
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [refresh]);

    const remove = useCallback(async (taskId) => {
        setSubmitting(true);
        setError(null);
        try {
            await deleteTask(taskId);
            await refresh();
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [refresh]);

    return {
        submitting,
        error,
        create,
        update,
        updateStatus,
        remove,
    };
}