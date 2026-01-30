// Document Analysis API Client (Port 8001)
const DOCUMENT_ANALYSIS_BASE_URL = import.meta.env.VITE_DOCUMENT_ANALYSIS_BASE_URL || 'http://localhost:8001';

// Simple fetch wrapper for Document Analysis API
class DocumentAnalysisApiClient {
    private async request<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
        const url = `${DOCUMENT_ANALYSIS_BASE_URL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...config.headers,
        };

        const response = await fetch(url, {
            ...config,
            headers,
        });

        if (!response.ok) {
            const error: any = new Error('Document Analysis API Error');
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

    async get<T>(endpoint: string, config?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    async post<TReq, TRes>(endpoint: string, data: TReq | null, config?: RequestInit): Promise<TRes> {
        return this.request<TRes>(endpoint, {
            ...config,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<TReq, TRes>(endpoint: string, data: TReq, config?: RequestInit): Promise<TRes> {
        return this.request<TRes>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string, config?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }

    // Special method for raw responses (blobs, etc)
    async postRaw(endpoint: string, data: any, config?: RequestInit): Promise<Blob> {
        const url = `${DOCUMENT_ANALYSIS_BASE_URL}${endpoint}`;
        
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
            const error: any = new Error('Document Analysis API Error');
            error.status = response.status;
            throw error;
        }

        return response.blob();
    }

    // Special method for FormData requests
    async postFormData<T>(endpoint: string, formData: FormData, config?: RequestInit): Promise<T> {
        // For FormData requests, we should not set Content-Type header
        // Let the browser set it with the proper boundary
        
        const headers = {
            ...config?.headers,
        };
        
        // Remove Content-Type from headers if it exists to let browser set it
        const finalHeaders = { ...headers };
        delete finalHeaders['Content-Type'];

        const url = `${DOCUMENT_ANALYSIS_BASE_URL}${endpoint}`;
        
        const response = await fetch(url, {
            ...config,
            method: 'POST',
            body: formData,
            headers: finalHeaders,
        });

        if (!response.ok) {
            const error: any = new Error('Document Analysis API Error');
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

export const documentAnalysisApiClient = new DocumentAnalysisApiClient();

// Document Processing Endpoints
export const extractText = async (formData: FormData): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.postFormData<any>('/extract-text/', formData);
        return response;
    } catch (error) {
        console.error('Failed to extract text:', error);
        throw error;
    }
};

export const analyzeClauses = async (data: any): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.post<any, any>('/analyze-clauses/', data);
        return response;
    } catch (error) {
        console.error('Failed to analyze clauses:', error);
        throw error;
    }
};

export const extractChronology = async (data: any): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.post<any, any>('/extract-chronology/', data);
        return response;
    } catch (error) {
        console.error('Failed to extract chronology:', error);
        throw error;
    }
};

export const chatWithDocument = async (data: any): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.post<any, any>('/chat-with-document/', data);
        return response;
    } catch (error) {
        console.error('Failed to chat with document:', error);
        throw error;
    }
};

export const summarizeDocuments = async (data: any): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.post<any, any>('/summarize-documents/', data);
        return response;
    } catch (error) {
        console.error('Failed to summarize documents:', error);
        throw error;
    }
};

export const assessRisks = async (data: any): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.post<any, any>('/assess-risks/', data);
        return response;
    } catch (error) {
        console.error('Failed to assess risks:', error);
        throw error;
    }
};

export const classifyDocument = async (data: any): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.post<any, any>('/classify-document/', data);
        return response;
    } catch (error) {
        console.error('Failed to classify document:', error);
        throw error;
    }
};

// Document Management Endpoints
export const uploadDocuments = async (formData: FormData): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.postFormData<any>('/extract-text/', formData);
        return response;
    } catch (error) {
        console.error('Failed to upload documents:', error);
        throw error;
    }
};

export const processDocuments = async (formData: FormData): Promise<any> => {
    try {
        const response = await documentAnalysisApiClient.postFormData<any>('/extract-text/', formData);
        return response;
    } catch (error) {
        console.error('Failed to process documents:', error);
        throw error;
    }
};

// System Endpoints
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
    try {
        const response = await documentAnalysisApiClient.get<{ status: string; message: string }>('/health/');
        return response;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};