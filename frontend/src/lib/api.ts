let accessTokenInMemory: string | null = null;

export function setAccessToken(token: string | null) {
  accessTokenInMemory = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function getAccessToken(): string | null {
  if (!accessTokenInMemory) {
    accessTokenInMemory = localStorage.getItem('accessToken');
  }
  return accessTokenInMemory;
}

let API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

// Auto-normalize API_BASE_URL to include '/api' if not present in an absolute URL
if (API_BASE_URL.startsWith('http') && !API_BASE_URL.includes('/api')) {
  API_BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/api`;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth, headers = {}, ...restOptions } = options;
  
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();
  if (token && !skipAuth) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let response = await fetch(url, {
    headers: requestHeaders,
    credentials: 'include',
    ...restOptions,
  });

  // Handle Token Expiry & Automatic Refresh
  if (response.status === 401 && token && !skipAuth) {
    try {
      // Attempt token refresh
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);

        // Retry original request with new token
        requestHeaders.set('Authorization', `Bearer ${newAccessToken}`);
        response = await fetch(url, {
          headers: requestHeaders,
          credentials: 'include',
          ...restOptions,
        });
      } else {
        // Refresh token failed, clear access token
        setAccessToken(null);
      }
    } catch (refreshError) {
      console.error('Failed to automatically refresh access token:', refreshError);
      setAccessToken(null);
    }
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred during the API request.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Response was not JSON
      console.error('API response is not JSON. Status:', response.status, 'Error:', e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
