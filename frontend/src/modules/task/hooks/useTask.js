import { useCallback } from "react";
import { getTask } from "../../../api/taskApi";
import { mapTaskFromApi } from "../services/taskMapper";

export default function useTask() {
    const find = useCallback(async (taskId) => {
        const response = await getTask(taskId);
        return mapTaskFromApi(response);
    }, []);

    return {
        find,
    };
}