/**
 * Centralized HTTP client for the URUK frontend to communicate with the backend.
 * All network calls should go through these helper functions.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:3001/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface StorageEntry<T = unknown> {
  value: T;
  updatedAt: string;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function request<TResponse = unknown, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;
  const { method = 'GET', body, headers = {}, signal } = options;

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include',
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const errorMessage =
      (data && (data.error || data.message)) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as TResponse;
}

export async function getStorageValue<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    const entry = await request<StorageEntry<T>>(
      `/storage/${encodeURIComponent(key)}`
    );
    if (entry && typeof entry.value !== 'undefined') {
      return entry.value;
    }
    return defaultValue;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return defaultValue;
    }
    console.error(`Failed to retrieve storage key ${key}:`, error);
    throw error;
  }
}

export async function setStorageValue<T>(
  key: string,
  value: T
): Promise<StorageEntry<T>> {
  return request<StorageEntry<T>, { value: T }>(
    `/storage/${encodeURIComponent(key)}`,
    {
      method: 'PUT',
      body: { value },
    }
  );
}

export async function deleteStorageValue(key: string): Promise<void> {
  await request<void>(`/storage/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
}

export async function bulkGetStorageValues(
  keys: string[]
): Promise<Record<string, StorageEntry>> {
  if (!keys.length) {
    return {};
  }
  return request<Record<string, StorageEntry>, { keys: string[] }>(
    '/storage/bulk',
    {
      method: 'POST',
      body: { keys },
    }
  );
}

export async function pingApi(): Promise<boolean> {
  try {
    await request('/test');
    return true;
  } catch (error) {
    console.error('Failed to reach backend:', error);
    return false;
  }
}

export { API_BASE_URL };
