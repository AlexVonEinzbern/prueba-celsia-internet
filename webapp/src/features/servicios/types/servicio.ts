import type { ServicioNombre } from '../../../constants/servicios'

/** Servicio tal como lo devuelve la API (`ServicioResponse`). */
export interface Servicio {
  servicio: ServicioNombre
  fechaInicio: string
  ultimaFacturacion: string
  ultimoPago: number
  identificacion: string
}

/** Cuerpo de creación/actualización de un servicio (`ServicioBase`). */
export interface ServicioPayload {
  servicio: ServicioNombre
  fechaInicio: string
  ultimaFacturacion: string
  ultimoPago: number
}
