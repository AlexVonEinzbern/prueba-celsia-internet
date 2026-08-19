import { Button } from '../../../components/ui/Button'
import { Table } from '../../../components/ui/Table'
import type { Columna } from '../../../components/ui/Table'
import { formatearFecha, formatearMoneda } from '../../../lib/utils/formatters'
import type { Servicio } from '../types/servicio'

interface ServicioTableProps {
  servicios: Servicio[]
  onEditar: (servicio: Servicio) => void
  onEliminar: (servicio: Servicio) => void
}

const columnas: Columna<Servicio>[] = [
  { encabezado: 'Servicio', render: (servicio) => servicio.servicio },
  {
    encabezado: 'Fecha de inicio',
    render: (servicio) => formatearFecha(servicio.fechaInicio),
  },
  {
    encabezado: 'Última facturación',
    render: (servicio) => formatearFecha(servicio.ultimaFacturacion),
  },
  {
    encabezado: 'Último pago',
    render: (servicio) => formatearMoneda(servicio.ultimoPago),
  },
]

/** Tabla de servicios contratados con acciones de edición y borrado. */
export function ServicioTable({ servicios, onEditar, onEliminar }: ServicioTableProps) {
  const columnasConAcciones: Columna<Servicio>[] = [
    ...columnas,
    {
      encabezado: 'Acciones',
      render: (servicio) => (
        <div className="fila-acciones">
          <Button variante="secundario" onClick={() => onEditar(servicio)}>
            Editar
          </Button>
          <Button variante="peligro" onClick={() => onEliminar(servicio)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Table
      columnas={columnasConAcciones}
      datos={servicios}
      obtenerClave={(servicio) => servicio.servicio}
      mensajeVacio="Este cliente no tiene servicios contratados."
    />
  )
}
