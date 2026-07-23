import { useCallback, useEffect, useRef, useState } from "react";
import { getTask, updateTask } from "../../../api/taskApi";
import { EMPTY_TASK } from "../services/taskDefaults";
import {
    mapTaskFromApi,
    mapTaskToUpdatePayload,
} from "../services/taskMapper";

export default function useTaskEdit(taskId) {
    const mountedRef = useRef(true);
    const [task, setTask] = useState(EMPTY_TASK);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        mountedRef.current = true;

        if (!taskId) {
            setError({
                detail: "Invalid task identifier.",
            });
            setLoading(false);
            return () => {
                mountedRef.current = false;
            };
        }

        const loadTask = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getTask(taskId);

                if (mountedRef.current) {
                    setTask(mapTaskFromApi(response));
                }
            } catch (err) {
                if (mountedRef.current) {
                    setError(err);
                }
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                }
            }
        };

        void loadTask();

        return () => {
            mountedRef.current = false;
        };
    }, [taskId]);

    const onChange = useCallback((field, value) => {
        setTask((current) => ({
            ...current,
            [field]: value,
        }));
    }, []);

    const save = useCallback(async (values) => {
        if (mountedRef.current) {
            setSubmitting(true);
            setError(null);
        }

        try {
            const response = await updateTask(
                taskId,
                mapTaskToUpdatePayload(values),
            );
            const updatedTask = mapTaskFromApi(response);

            if (mountedRef.current) {
                setTask(updatedTask);
            }

            return updatedTask;
        } catch (err) {
            if (mountedRef.current) {
                setError(err);
            }
            throw err;
        } finally {
            if (mountedRef.current) {
                setSubmitting(false);
            }
        }
    }, [taskId]);

    return {
        task,
        loading,
        submitting,
        error,
        onChange,
        save,
    };
}