import { useEffect, useState } from 'react'
import { toApiError } from '../../../lib/api/errors'
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
} from '../services/clienteService'
import type { ClienteConServicios, ClientePayload } from '../types/cliente'

interface UseClientesResultado {
  clientes: ClienteConServicios[]
  cargando: boolean
  error: string | null
  recargar: () => Promise<void>
  crear: (payload: ClientePayload) => Promise<void>
  actualizar: (identificacion: string, payload: ClientePayload) => Promise<void>
  eliminar: (identificacion: string) => Promise<void>
}

export function useClientes(): UseClientesResultado {
  const [clientes, setClientes] = useState<ClienteConServicios[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function recargar(): Promise<void> {
    setCargando(true)
    setError(null)
    try {
      const datos = await listarClientes()
      setClientes(datos)
    } catch (e) {
      setError(toApiError(e).message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let activo = true
    setCargando(true)
    listarClientes()
      .then((datos) => {
        if (activo) setClientes(datos)
      })
      .catch((e: unknown) => {
        if (activo) setError(toApiError(e).message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [])

  async function crear(payload: ClientePayload): Promise<void> {
    await crearCliente(payload)
    await recargar()
  }

  async function actualizar(identificacion: string, payload: ClientePayload): Promise<void> {
    await actualizarCliente(identificacion, payload)
    await recargar()
  }

  async function eliminar(identificacion: string): Promise<void> {
    await eliminarCliente(identificacion)
    await recargar()
  }

  return { clientes, cargando, error, recargar, crear, actualizar, eliminar }
}
