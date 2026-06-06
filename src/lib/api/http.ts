const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData

  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(!isFormData && init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
    ...init,
  })

  const contentType = res.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (data as Record<string, string>)?.error ?? res.statusText,
      data
    )
  }

  return data as T
}

export const http = {
  get:   <T,>(path: string) =>
    request<T>(path),
  post:  <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put:   <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT',   body: JSON.stringify(body) }),
  patch: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del:   <T,>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
}
