let accessTokenInMemory: string | null = null;
let refreshTokenInMemory: string | null = null;

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

export function setRefreshToken(token: string | null) {
  refreshTokenInMemory = token;
  if (token) {
    localStorage.setItem('refreshToken', token);
  } else {
    localStorage.removeItem('refreshToken');
  }
}

export function getRefreshToken(): string | null {
  if (!refreshTokenInMemory) {
    refreshTokenInMemory = localStorage.getItem('refreshToken');
  }
  return refreshTokenInMemory;
}

let API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

// Auto-normalize API_BASE_URL to include '/api' if not present in an absolute URL
if (API_BASE_URL.startsWith('http') && !API_BASE_URL.includes('/api')) {
  API_BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/api`;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  timeoutMs?: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth, timeoutMs = 15000, headers = {}, ...restOptions } = options;

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const token = getAccessToken();
  if (token && !skipAuth) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  console.log(`[API Request] ${options.method || 'GET'} -> ${url}`);

  // Setup AbortController for 15-second timeout (Requirement #18)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: requestHeaders,
      credentials: 'include',
      signal: controller.signal,
      ...restOptions
    });
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    console.error(`[API Network/Timeout Error] ${endpoint}:`, fetchErr);
    if (fetchErr.name === 'AbortError') {
      throw new Error('Request timed out (exceeded 15s). Please check your server connection and try again.');
    }
    throw new Error('Network failure: Unable to connect to the backend server. Please check CORS or server status.');
  } finally {
    clearTimeout(timeoutId);
  }

  console.log(`[API Response] Status ${response.status} from ${endpoint}`);

  // Handle Token Expiry & Automatic Refresh (Requirement #7, #8)
  if (response.status === 401 && !skipAuth) {
    const storedRefreshToken = getRefreshToken();
    if (storedRefreshToken || token) {
      try {
        console.log('[API] 401 Received. Attempting token refresh...');
        const refreshController = new AbortController();
        const refreshTimeoutId = setTimeout(() => refreshController.abort(), 10000);
        
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(storedRefreshToken ? { 'x-refresh-token': storedRefreshToken } : {})
          },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
          credentials: 'include',
          signal: refreshController.signal
        }).finally(() => clearTimeout(refreshTimeoutId));

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.accessToken || refreshData.token;
          if (newAccessToken) {
            console.log('[API] Token refresh successful. Retrying original request...');
            setAccessToken(newAccessToken);
            if (refreshData.refreshToken) {
              setRefreshToken(refreshData.refreshToken);
            }

            // Retry original request with new token
            requestHeaders.set('Authorization', `Bearer ${newAccessToken}`);
            const retryController = new AbortController();
            const retryTimeoutId = setTimeout(() => retryController.abort(), timeoutMs);
            
            response = await fetch(url, {
              headers: requestHeaders,
              credentials: 'include',
              signal: retryController.signal,
              ...restOptions
            }).finally(() => clearTimeout(retryTimeoutId));
          } else {
            setAccessToken(null);
            setRefreshToken(null);
            window.dispatchEvent(new Event('auth-unauthorized'));
          }
        } else {
          setAccessToken(null);
          setRefreshToken(null);
          window.dispatchEvent(new Event('auth-unauthorized'));
        }
      } catch (refreshError) {
        console.error('[API] Failed to automatically refresh access token:', refreshError);
        setAccessToken(null);
        setRefreshToken(null);
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
    } else {
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
  }

  if (!response.ok) {
    let errorMessage = `Server error (${response.status}).`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      console.error('[API] Non-JSON error response. Status:', response.status);
    }
    console.error(`[API Error] Endpoint ${endpoint} failed with message:`, errorMessage);
    throw new Error(errorMessage);
  }

  let jsonResult: any;
  try {
    jsonResult = await response.json();
  } catch (jsonErr) {
    console.warn('[API] Empty or non-JSON success response:', jsonErr);
    return {} as T;
  }

  // Handle envelope responses: if response object has success & data fields, return data if present
  if (jsonResult && typeof jsonResult === 'object' && 'success' in jsonResult && 'data' in jsonResult) {
    return jsonResult.data !== undefined ? jsonResult.data : jsonResult;
  }

  return jsonResult;
}

