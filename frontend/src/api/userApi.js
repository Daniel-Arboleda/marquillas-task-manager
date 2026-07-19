import httpClient from "./httpClient";

const USER_ENDPOINT = "/api/users";

export async function createUser(payload) {
  return httpClient.post(USER_ENDPOINT, payload);
}