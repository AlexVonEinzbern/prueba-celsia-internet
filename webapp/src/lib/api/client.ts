import { parseApiError, toApiError } from './errors'

/**
 * Cliente HTTP centralizado.
 *
 * Las peticiones usan rutas relativas (`/api/...`) para que el navegador
 * hable siempre con su mismo origen: la API no expone cabeceras CORS.
 * - En desarrollo, `server.proxy` de Vite reenvía `/api` a `VITE_API_URL`.
 * - En Docker, nginx actúa como proxy inverso hacia la API.
 *
 * El origen real de la API se configura en `VITE_API_URL` (ver .env.example).
 */
const API_PREFIX = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_PREFIX}${path}`, {
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
