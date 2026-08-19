import { Button } from '../../../components/ui/Button'
import { Table } from '../../../components/ui/Table'
import type { Columna } from '../../../components/ui/Table'
import { TIPOS_IDENTIFICACION } from '../../../constants/tiposIdentificacion'
import type { ClienteConServicios } from '../types/cliente'

interface ClienteTableProps {
  clientes: ClienteConServicios[]
  onEditar: (cliente: ClienteConServicios) => void
  onEliminar: (cliente: ClienteConServicios) => void
}

export function ClienteTable({ clientes, onEditar, onEliminar }: ClienteTableProps) {
  const columnas: Columna<ClienteConServicios>[] = [
    { encabezado: 'Identificación', render: (cliente) => cliente.identificacion },
    { encabezado: 'Nombres', render: (cliente) => cliente.nombres },
    { encabezado: 'Apellidos', render: (cliente) => cliente.apellidos },
    {
      encabezado: 'Tipo',
      render: (cliente) =>
        TIPOS_IDENTIFICACION.find((tipo) => tipo.value === cliente.tipoIdentificacion)?.label ??
        cliente.tipoIdentificacion,
    },
    { encabezado: 'Celular', render: (cliente) => cliente.numeroCelular },
    { encabezado: 'Correo', render: (cliente) => cliente.correoElectronico },
    {
      encabezado: 'Acciones',
      render: (cliente) => (
        <div className="fila-acciones">
          <Button variante="fantasma" onClick={() => onEditar(cliente)}>
            Editar
          </Button>
          <Button variante="peligro" onClick={() => onEliminar(cliente)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Table<ClienteConServicios>
      columnas={columnas}
      datos={clientes}
      obtenerClave={(cliente) => cliente.identificacion}
      mensajeVacio="No hay clientes registrados."
    />
  )
}
