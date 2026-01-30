// Simple fetch wrapper to replace axios
const BASE_URL = import.meta.env.VITE_AUTH_SERVICE_BASE_URL || '';

interface RequestConfig extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        };

        const response = await fetch(url, {
            ...config,
            headers,
        });

        if (!response.ok) {
            const error: any = new Error('API Error');
            error.status = response.status;
            error.statusText = response.statusText;
            try {
                error.data = await response.json();
            } catch (e) {
                error.data = null;
            }
            throw error;
        }

        // Handle empty responses
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    async post<TReq, TRes>(endpoint: string, data: TReq | null, config?: RequestConfig): Promise<TRes> {
        return this.request<TRes>(endpoint, {
            ...config,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<TReq, TRes>(endpoint: string, data: TReq, config?: RequestConfig): Promise<TRes> {
        return this.request<TRes>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }

    // Special method for raw responses (blobs, etc)
    async postRaw(endpoint: string, data: any, config?: RequestConfig): Promise<Blob> {
        const url = `${BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...config?.headers,
        };

        const response = await fetch(url, {
            ...config,
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error: any = new Error('API Error');
            error.status = response.status;
            throw error;
        }

        return response.blob();
    }

    // Special method for FormData requests
    async postFormData<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<T> {
        // For FormData requests, we should not set Content-Type header
        // Let the browser set it with the proper boundary

        const headers = {
            ...config?.headers,
        };

        // Remove Content-Type from headers if it exists to let browser set it
        const finalHeaders = { ...headers };
        delete finalHeaders['Content-Type'];

        const url = `${BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            ...config,
            method: 'POST',
            body: formData,
            headers: finalHeaders,
        });

        if (!response.ok) {
            const error: any = new Error('API Error');
            error.status = response.status;
            error.statusText = response.statusText;
            try {
                error.data = await response.json();
            } catch (e) {
                error.data = null;
            }
            throw error;
        }

        // Handle empty responses
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }
}

export const apiClient = new ApiClient();