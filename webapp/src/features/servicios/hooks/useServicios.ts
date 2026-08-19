import { useEffect, useState } from 'react'
import { toApiError } from '../../../lib/api/errors'
import {
  actualizarServicio,
  asociarServicio,
  eliminarServicio,
  listarServicios,
} from '../services/servicioService'
import type { Servicio, ServicioPayload } from '../types/servicio'

interface UseServiciosResult {
  servicios: Servicio[]
  cargando: boolean
  error: string | null
  contratar: (payload: ServicioPayload) => Promise<void>
  actualizar: (nombre: string, payload: ServicioPayload) => Promise<void>
  eliminar: (nombre: string) => Promise<void>
}

/**
 * Carga y administra los servicios del cliente seleccionado.
 * Sin identificación no consulta nada y la lista queda vacía.
 * Las mutaciones refrescan la lista y relanzan el ApiError.
 */
export function useServicios(identificacion: string | null): UseServiciosResult {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function cargar(id: string): Promise<void> {
    setCargando(true)
    setError(null)
    try {
      setServicios(await listarServicios(id))
    } catch (e) {
      setServicios([])
      setError(toApiError(e).message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (identificacion) {
      void cargar(identificacion)
    } else {
      setServicios([])
      setError(null)
    }
    // cargar solo depende de la identificación seleccionada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identificacion])

  async function contratar(payload: ServicioPayload): Promise<void> {
    if (!identificacion) return
    await asociarServicio(identificacion, payload)
    await cargar(identificacion)
  }

  async function actualizar(nombre: string, payload: ServicioPayload): Promise<void> {
    if (!identificacion) return
    await actualizarServicio(identificacion, nombre, payload)
    await cargar(identificacion)
  }

  async function eliminar(nombre: string): Promise<void> {
    if (!identificacion) return
    await eliminarServicio(identificacion, nombre)
    await cargar(identificacion)
  }

  return { servicios, cargando, error, contratar, actualizar, eliminar }
}
