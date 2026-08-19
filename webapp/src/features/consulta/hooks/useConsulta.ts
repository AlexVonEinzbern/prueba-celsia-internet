import { useState } from 'react'
import { toApiError } from '../../../lib/api/errors'
import { obtenerCliente } from '../../clientes/services/clienteService'
import type { ClienteConServicios } from '../../clientes/types/cliente'

interface UseConsultaResult {
  cliente: ClienteConServicios | null
  cargando: boolean
  error: string | null
  consultar: (identificacion: string) => Promise<void>
  limpiar: () => void
}

/** Consulta puntual de un cliente por identificación. */
export function useConsulta(): UseConsultaResult {
  const [cliente, setCliente] = useState<ClienteConServicios | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function consultar(identificacion: string): Promise<void> {
    setCargando(true)
    setError(null)
    try {
      setCliente(await obtenerCliente(identificacion))
    } catch (e) {
      setCliente(null)
      setError(toApiError(e).message)
    } finally {
      setCargando(false)
    }
  }

  function limpiar(): void {
    setCliente(null)
    setError(null)
  }

  return { cliente, cargando, error, consultar, limpiar }
}
