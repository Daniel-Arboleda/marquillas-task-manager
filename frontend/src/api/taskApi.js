import httpClient from "./httpClient";

const TASKS_ENDPOINT = "/api/tasks";

function buildQueryParams(params = {}) {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== ""
        )
    );
}

export const listTasks = (params = {}) =>
    httpClient.get(TASKS_ENDPOINT, {
        params: buildQueryParams(params),
    });

export const getTask = (taskId) =>
    httpClient.get(`${TASKS_ENDPOINT}/${taskId}`);

export const getTaskHistory = (taskId) =>
    httpClient.get(`${TASKS_ENDPOINT}/${taskId}/history`);

export const createTask = (payload) =>
    httpClient.post(TASKS_ENDPOINT, payload);

export const updateTask = (taskId, payload) =>
    httpClient.patch(`${TASKS_ENDPOINT}/${taskId}`, payload);

export const deleteTask = (taskId) =>
    httpClient.delete(`${TASKS_ENDPOINT}/${taskId}`);