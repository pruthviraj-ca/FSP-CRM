const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  
  // Leads
  LEADS: '/leads/',
  LEAD_DETAIL: (id: string) => `/leads/${id}/`,
  UPDATE_LEAD_STATUS: (id: string) => `/leads/${id}/status/`,
  UPDATE_LEAD_FOLLOWUP: (id: string) => `/leads/${id}/followup/`,
  
  // Properties
  PROPERTIES: '/properties/',
  PROPERTY_DETAIL: (id: string) => `/properties/${id}/`,
  UPLOAD_PROPERTY: '/properties/upload/',
  
  // Flats
  FLATS: '/flats/',
  FLAT_DETAIL: (id: string) => `/flats/${id}/`,
  
  // Test endpoint
  HELLO: '/hello/',
} as const; 