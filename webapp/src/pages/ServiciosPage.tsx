import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Select } from '../components/ui/Select'
import { Spinner } from '../components/ui/Spinner'
import { useClientes } from '../features/clientes/hooks/useClientes'
import { ServicioModal } from '../features/servicios/components/ServicioModal'
import { ServicioTable } from '../features/servicios/components/ServicioTable'
import { useServicios } from '../features/servicios/hooks/useServicios'
import type { Servicio, ServicioPayload } from '../features/servicios/types/servicio'
import { toApiError } from '../lib/api/errors'

/** Página de administración de servicios por cliente. */
export function ServiciosPage() {
  const { clientes, error: errorClientes } = useClientes()
  const [seleccionado, setSeleccionado] = useState('')
  const { servicios, cargando, error, contratar, actualizar, eliminar } = useServicios(
    seleccionado || null,
  )

  const [modalAbierto, setModalAbierto] = useState(false)
  const [servicioEdicion, setServicioEdicion] = useState<Servicio | null>(null)
  const [servicioEliminar, setServicioEliminar] = useState<Servicio | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  const opcionesClientes = clientes.map((cliente) => ({
    value: cliente.identificacion,
    label: `${cliente.nombres} ${cliente.apellidos} — ${cliente.identificacion}`,
  }))

  function abrirContratar(): void {
    setServicioEdicion(null)
    setModalAbierto(true)
  }

  function abrirEditar(servicio: Servicio): void {
    setServicioEdicion(servicio)
    setModalAbierto(true)
  }

  function cerrarModal(): void {
    setModalAbierto(false)
    setServicioEdicion(null)
  }

  async function manejarGuardar(payload: ServicioPayload): Promise<void> {
    if (servicioEdicion) {
      await actualizar(servicioEdicion.servicio, payload)
    } else {
      await contratar(payload)
    }
  }

  function solicitarEliminar(servicio: Servicio): void {
    setErrorEliminar(null)
    setServicioEliminar(servicio)
  }

  async function confirmarEliminar(): Promise<void> {
    if (!servicioEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await eliminar(servicioEliminar.servicio)
      setServicioEliminar(null)
    } catch (e) {
      setErrorEliminar(toApiError(e).message)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <PageContainer
      titulo="Servicios"
      descripcion="Consulta, contrata y administra los servicios de un cliente."
      acciones={
        seleccionado ? (
          <Button variante="primario" onClick={abrirContratar}>
            Contratar servicio
          </Button>
        ) : undefined
      }
    >
      <Select
        label="Cliente"
        opciones={opcionesClientes}
        placeholder="Selecciona un cliente"
        value={seleccionado}
        onChange={(e) => setSeleccionado(e.target.value)}
      />
      {errorClientes && <Alert variante="error">{errorClientes}</Alert>}
      {!seleccionado ? (
        <p className="texto-secundario">
          Selecciona un cliente para ver y contratar servicios.
        </p>
      ) : cargando ? (
        <Spinner etiqueta="Cargando servicios..." />
      ) : error ? (
        <Alert variante="error">{error}</Alert>
      ) : (
        <ServicioTable
          servicios={servicios}
          onEditar={abrirEditar}
          onEliminar={solicitarEliminar}
        />
      )}
      <ServicioModal
        abierto={modalAbierto}
        servicio={servicioEdicion}
        onCerrar={cerrarModal}
        onGuardar={manejarGuardar}
      />
      <Modal
        abierto={servicioEliminar !== null}
        titulo="Eliminar servicio"
        onCerrar={() => setServicioEliminar(null)}
      >
        <p>
          ¿Eliminar el servicio {servicioEliminar?.servicio} del cliente seleccionado?
        </p>
        {errorEliminar && <Alert variante="error">{errorEliminar}</Alert>}
        <div className="fila-acciones">
          <Button variante="peligro" cargando={eliminando} onClick={confirmarEliminar}>
            Eliminar
          </Button>
          <Button variante="secundario" onClick={() => setServicioEliminar(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}
