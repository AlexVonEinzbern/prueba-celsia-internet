import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Spinner } from '../components/ui/Spinner'
import { ClienteModal } from '../features/clientes/components/ClienteModal'
import { ClienteTable } from '../features/clientes/components/ClienteTable'
import { useClientes } from '../features/clientes/hooks/useClientes'
import type {
  Cliente,
  ClienteConServicios,
  ClientePayload,
} from '../features/clientes/types/cliente'
import { toApiError } from '../lib/api/errors'

export function ClientesPage() {
  const { clientes, cargando, error, recargar, crear, actualizar, eliminar } = useClientes()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [clienteEnEdicion, setClienteEnEdicion] = useState<Cliente | null>(null)
  const [clienteAEliminar, setClienteAEliminar] = useState<ClienteConServicios | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  function abrirCreacion(): void {
    setClienteEnEdicion(null)
    setModalAbierto(true)
  }

  function abrirEdicion(cliente: ClienteConServicios): void {
    setClienteEnEdicion(cliente)
    setModalAbierto(true)
  }

  function cerrarModal(): void {
    setModalAbierto(false)
    setClienteEnEdicion(null)
  }

  async function guardar(payload: ClientePayload): Promise<void> {
    if (clienteEnEdicion) {
      await actualizar(clienteEnEdicion.identificacion, payload)
    } else {
      await crear(payload)
    }
  }

  function solicitarEliminar(cliente: ClienteConServicios): void {
    setErrorEliminar(null)
    setClienteAEliminar(cliente)
  }

  function cancelarEliminar(): void {
    if (eliminando) return
    setClienteAEliminar(null)
    setErrorEliminar(null)
  }

  async function confirmarEliminar(): Promise<void> {
    if (!clienteAEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminar(clienteAEliminar.identificacion)
      setClienteAEliminar(null)
    } catch (e) {
      setErrorEliminar(toApiError(e).message)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <PageContainer
      titulo="Clientes"
      descripcion="Gestiona los clientes registrados en Celsia Internet."
      acciones={
        <Button variante="primario" onClick={abrirCreacion}>
          Nuevo cliente
        </Button>
      }
    >
      {cargando ? (
        <Spinner etiqueta="Cargando clientes..." />
      ) : error ? (
        <Alert variante="error">
          <p>{error}</p>
          <Button variante="secundario" onClick={() => void recargar()}>
            Reintentar
          </Button>
        </Alert>
      ) : (
        <ClienteTable clientes={clientes} onEditar={abrirEdicion} onEliminar={solicitarEliminar} />
      )}

      <ClienteModal
        abierto={modalAbierto}
        cliente={clienteEnEdicion}
        onCerrar={cerrarModal}
        onGuardar={guardar}
      />

      <Modal
        abierto={clienteAEliminar !== null}
        titulo="Eliminar cliente"
        onCerrar={cancelarEliminar}
      >
        {clienteAEliminar && (
          <>
            {errorEliminar && (
              <Alert variante="error" onCerrar={() => setErrorEliminar(null)}>
                {errorEliminar}
              </Alert>
            )}
            <p>
              ¿Eliminar al cliente {clienteAEliminar.nombres} {clienteAEliminar.apellidos} (
              {clienteAEliminar.identificacion})? Esta acción no se puede deshacer.
            </p>
            <div className="fila-acciones">
              <Button variante="secundario" onClick={cancelarEliminar} disabled={eliminando}>
                Cancelar
              </Button>
              <Button
                variante="peligro"
                cargando={eliminando}
                onClick={() => void confirmarEliminar()}
              >
                Eliminar
              </Button>
            </div>
          </>
        )}
      </Modal>
    </PageContainer>
  )
}
