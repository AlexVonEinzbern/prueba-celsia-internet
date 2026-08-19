import { Modal } from '../../../components/ui/Modal'
import type { ClienteFormValues } from '../schemas/clienteSchema'
import type { Cliente, ClientePayload } from '../types/cliente'
import { ClienteForm } from './ClienteForm'

interface ClienteModalProps {
  abierto: boolean
  cliente: Cliente | null
  onCerrar: () => void
  onGuardar: (payload: ClientePayload) => Promise<void>
}

export function ClienteModal({ abierto, cliente, onCerrar, onGuardar }: ClienteModalProps) {
  async function manejarGuardar(values: ClienteFormValues): Promise<void> {
    await onGuardar(values)
    onCerrar()
  }

  return (
    <Modal
      abierto={abierto}
      titulo={cliente ? 'Editar cliente' : 'Nuevo cliente'}
      onCerrar={onCerrar}
    >
      <ClienteForm
        key={cliente?.identificacion ?? 'nuevo'}
        valoresIniciales={cliente ?? undefined}
        enEdicion={cliente !== null}
        onSubmit={manejarGuardar}
        onCancelar={onCerrar}
      />
    </Modal>
  )
}
