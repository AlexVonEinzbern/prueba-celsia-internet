import { Modal } from '../../../components/ui/Modal'
import type { ServicioFormValues } from '../schemas/servicioSchema'
import type { Servicio, ServicioPayload } from '../types/servicio'
import { ServicioForm } from './ServicioForm'

interface ServicioModalProps {
  abierto: boolean
  servicio: Servicio | null
  onCerrar: () => void
  onGuardar: (payload: ServicioPayload) => Promise<void>
}

/** Modal de contratación (servicio null) o edición de un servicio. */
export function ServicioModal({ abierto, servicio, onCerrar, onGuardar }: ServicioModalProps) {
  async function manejarGuardar(values: ServicioFormValues): Promise<void> {
    await onGuardar(values)
    onCerrar()
  }

  return (
    <Modal
      abierto={abierto}
      titulo={servicio ? 'Editar servicio' : 'Contratar servicio'}
      onCerrar={onCerrar}
    >
      <ServicioForm
        key={servicio?.servicio ?? 'nuevo'}
        valoresIniciales={servicio ?? undefined}
        enEdicion={servicio !== null}
        onSubmit={manejarGuardar}
        onCancelar={onCerrar}
      />
    </Modal>
  )
}
