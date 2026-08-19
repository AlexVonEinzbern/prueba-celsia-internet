import { parseApiError, toApiError } from './errors'

/**
 * Cliente HTTP centralizado.
 *
 * Las peticiones van directo al origen de la API: el backend ya expone las
 * cabeceras CORS (ver `CORS_ORIGINS` en api/app/main.py), así que el navegador
 * puede hablar con otro origen sin necesidad de proxy.
 *
 * El origen se configura en `VITE_API_URL` (ver .env.example). Debe ser
 * alcanzable desde el navegador y estar permitido por el CORS del backend.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_PREFIX = '/api/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (error) {
    throw toApiError(error)
  }

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path)
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
}

export function apiDelete(path: string): Promise<void> {
  return request<void>(path, { method: 'DELETE' })
}
