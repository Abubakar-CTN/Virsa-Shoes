const DEFAULT_API_BASE_URL = "/api";

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export class ApiError extends Error {
    constructor(
        message,
        {
            status = 0,
            code = "API_ERROR",
            details = null,
        } = {},
    ) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

function buildUrl(path, query) {
    const normalizedPath = String(path).replace(/^\/+/, "");
    const fullPath = `${API_BASE_URL}/${normalizedPath}`;

    const url = new URL(fullPath, window.location.origin);

    if (query && typeof query === "object") {
        Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item) => {
                    if (item !== undefined && item !== null) {
                        url.searchParams.append(key, String(item));
                    }
                });

                return;
            }

            url.searchParams.set(key, String(value));
        });
    }

    return url.toString();
}

async function parseResponse(response) {
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("json")) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    return text;
}

async function request(path, options = {}) {
    const {
        method = "GET",
        body,
        headers: customHeaders,
        signal,
        query,
        credentials = "same-origin",
        ...fetchOptions
    } = options;

    const headers = new Headers(customHeaders || {});

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }

    let requestBody = body;

    const isFormData =
        typeof FormData !== "undefined" &&
        body instanceof FormData;

    const isBlob =
        typeof Blob !== "undefined" &&
        body instanceof Blob;

    const isSearchParams =
        typeof URLSearchParams !== "undefined" &&
        body instanceof URLSearchParams;

    if (
        body !== undefined &&
        body !== null &&
        typeof body !== "string" &&
        !isFormData &&
        !isBlob &&
        !isSearchParams
    ) {
        requestBody = JSON.stringify(body);

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
    }

    let response;

    try {
        response = await fetch(buildUrl(path, query), {
            ...fetchOptions,
            method,
            headers,
            body: requestBody,
            signal,
            credentials,
        });
    } catch (error) {
        if (error?.name === "AbortError") {
            throw error;
        }

        throw new ApiError(
            "Network request failed. Check your connection and try again.",
            {
                code: "NETWORK_ERROR",
            },
        );
    }

    let data;

    try {
        data = await parseResponse(response);
    } catch {
        throw new ApiError(
            "The server response could not be read.",
            {
                status: response.status,
                code: "INVALID_RESPONSE",
            },
        );
    }

    if (!response.ok) {
        const serverMessage =
            data && typeof data === "object"
                ? data.message || data.error
                : null;

        const message =
            typeof serverMessage === "string" && serverMessage.trim()
                ? serverMessage
                : `Request failed with status ${response.status}.`;

        const code =
            data && typeof data === "object" &&
                typeof data.code === "string"
                ? data.code
                : `HTTP_${response.status}`;

        throw new ApiError(message, {
            status: response.status,
            code,
            details: data,
        });
    }

    return data;
}

export const apiClient = {
    request,

    get(path, options = {}) {
        return request(path, {
            ...options,
            method: "GET",
        });
    },

    post(path, body, options = {}) {
        return request(path, {
            ...options,
            method: "POST",
            body,
        });
    },

    put(path, body, options = {}) {
        return request(path, {
            ...options,
            method: "PUT",
            body,
        });
    },

    patch(path, body, options = {}) {
        return request(path, {
            ...options,
            method: "PATCH",
            body,
        });
    },

    delete(path, options = {}) {
        return request(path, {
            ...options,
            method: "DELETE",
        });
    },
};

export default apiClient;