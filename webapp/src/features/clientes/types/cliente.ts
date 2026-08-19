import type { TipoIdentificacion } from '../../../constants/tiposIdentificacion'
import type { Servicio } from '../../servicios/types/servicio'

/** Datos del cliente compartidos por creación y respuesta. */
export interface Cliente {
  identificacion: string
  nombres: string
  apellidos: string
  tipoIdentificacion: TipoIdentificacion
  fechaNacimiento: string
  numeroCelular: string
  correoElectronico: string
}

/** Respuesta de la API (`ClienteResponse`): incluye los servicios contratados. */
export interface ClienteConServicios extends Cliente {
  servicios: Servicio[]
}

/** Cuerpo de creación/actualización de un cliente (`ClienteCreate`). */
export type ClientePayload = Cliente
