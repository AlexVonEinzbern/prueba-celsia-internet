import { apiDelete, apiGet, apiPost, apiPut } from '../../../lib/api/client'
import type { ClienteConServicios, ClientePayload } from '../types/cliente'

const RUTA = '/clientes'

export function listarClientes(): Promise<ClienteConServicios[]> {
  return apiGet<ClienteConServicios[]>(RUTA)
}

export function obtenerCliente(identificacion: string): Promise<ClienteConServicios> {
  return apiGet<ClienteConServicios>(`${RUTA}/${encodeURIComponent(identificacion)}`)
}

export function crearCliente(payload: ClientePayload): Promise<ClienteConServicios> {
  return apiPost<ClienteConServicios>(RUTA, payload)
}

export function actualizarCliente(
  identificacion: string,
  payload: ClientePayload,
): Promise<ClienteConServicios> {
  return apiPut<ClienteConServicios>(
    `${RUTA}/${encodeURIComponent(identificacion)}`,
    payload,
  )
}

export function eliminarCliente(identificacion: string): Promise<void> {
  return apiDelete(`${RUTA}/${encodeURIComponent(identificacion)}`)
}
