import { apiDelete, apiGet, apiPost, apiPut } from '../../../lib/api/client'
import type { Servicio, ServicioPayload } from '../types/servicio'

function rutaServicios(identificacion: string): string {
  return `/clientes/${encodeURIComponent(identificacion)}/servicios`
}

function rutaServicio(identificacion: string, servicio: string): string {
  return `${rutaServicios(identificacion)}/${encodeURIComponent(servicio)}`
}

export function listarServicios(identificacion: string): Promise<Servicio[]> {
  return apiGet<Servicio[]>(rutaServicios(identificacion))
}

export function asociarServicio(
  identificacion: string,
  payload: ServicioPayload,
): Promise<Servicio> {
  return apiPost<Servicio>(rutaServicios(identificacion), payload)
}

export function actualizarServicio(
  identificacion: string,
  servicio: string,
  payload: ServicioPayload,
): Promise<Servicio> {
  return apiPut<Servicio>(rutaServicio(identificacion, servicio), payload)
}

export function eliminarServicio(identificacion: string, servicio: string): Promise<void> {
  return apiDelete(rutaServicio(identificacion, servicio))
}
