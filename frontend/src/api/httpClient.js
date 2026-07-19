import TokenStorage from "../auth/TokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function buildHeaders(token, headers = {}) {
    const accessToken = token ?? TokenStorage.getToken();
    return {
        Accept: "application/json",
        ...headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
}

function buildUrl(path, params) {
    if (!params || Object.keys(params).length === 0) {
        return `${API_BASE_URL}${path}`;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value);
        }
    });

    const query = searchParams.toString();

    return query
        ? `${API_BASE_URL}${path}?${query}`
        : `${API_BASE_URL}${path}`;
}

async function request(path, { method = "GET", body, token, headers, params } = {}) {
    const response = await fetch(buildUrl(path, params), {
        method,
        headers: buildHeaders(
            token,
            body === undefined
                ? headers
                : {
                      "Content-Type": "application/json",
                      ...headers,
                  },
        ),
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        let error;

        try {
            error = await response.json();
        } catch {
            error = {
                detail: response.statusText,
            };
        }

        throw {
            status: response.status,
            ...error,
        };
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function get(path, options) {
    return request(path, {
        ...options,
        method: "GET",
    });
}

export function post(path, body, options) {
    return request(path, {
        ...options,
        method: "POST",
        body,
    });
}

export function patch(path, body, options) {
    return request(path, {
        ...options,
        method: "PATCH",
        body,
    });
}

export function del(path, options) {
    return request(path, {
        ...options,
        method: "DELETE",
    });
}

const httpClient = {
    get,
    post,
    patch,
    delete: del,
};

export default httpClient;