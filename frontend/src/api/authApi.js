import httpClient from "./httpClient";

const AUTH_BASE_PATH = "/api/auth";

export const login = (payload) =>
  httpClient.post(`${AUTH_BASE_PATH}/login`, payload);

export const getCurrentUser = () =>
  httpClient.get(`${AUTH_BASE_PATH}/me`);

const authApi = {
  login,
  getCurrentUser,
};

export default authApi;