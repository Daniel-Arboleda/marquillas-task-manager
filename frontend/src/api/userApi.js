import httpClient from "./httpClient";

const USER_ENDPOINT = "/api/users";

export function listUsers() {
    return httpClient.get(USER_ENDPOINT);
}

export async function createUser(payload) {
    return httpClient.post(USER_ENDPOINT, payload);
}