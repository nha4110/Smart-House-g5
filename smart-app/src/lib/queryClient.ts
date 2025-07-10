import { QueryClient, QueryFunction } from '@tanstack/react-query';

// Determine base API URL from environment
const BASE_URL =
  typeof import.meta !== 'undefined' &&
  import.meta.env &&
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:8081/api';

/**
 * Helper to throw if response is not OK (non-2xx)
 */
async function throwIfResNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Perform API request (GET, POST, etc.) with JSON body
 * @param method HTTP method
 * @param path Relative path like "/users"
 * @param data Optional JSON payload
 */
export async function apiRequest(
  method: string,
  path: string,
  data?: unknown
): Promise<Response> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: data ? { 'Content-Type': 'application/json' } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = 'returnNull' | 'throw';

/**
 * Create a typed query function for use with React Query
 * Handles 401 behavior
 */
export function getQueryFn<T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> {
  return async ({ queryKey }) => {
    const url = `${BASE_URL}${queryKey[0] as string}`;
    const res = await fetch(url, {
      credentials: 'include',
    });

    if (options.on401 === 'returnNull' && res.status === 401) {
      return null as unknown as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
}

/**
 * React Query Client (shared across app)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchOnWindowFocus: false,
      refetchInterval: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
