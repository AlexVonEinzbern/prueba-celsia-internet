import { Table } from '../../../components/ui/Table'
import type { Columna } from '../../../components/ui/Table'
import { TIPOS_IDENTIFICACION } from '../../../constants/tiposIdentificacion'
import { formatearFecha, formatearMoneda } from '../../../lib/utils/formatters'
import type { ClienteConServicios } from '../../clientes/types/cliente'
import type { Servicio } from '../../servicios/types/servicio'

interface ClienteDetalleProps {
  cliente: ClienteConServicios
}

const columnasServicios: Columna<Servicio>[] = [
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

/** Ficha del cliente consultado con sus datos y servicios contratados. */
export function ClienteDetalle({ cliente }: ClienteDetalleProps) {
  const tipoIdentificacion =
    TIPOS_IDENTIFICACION.find((tipo) => tipo.value === cliente.tipoIdentificacion)?.label ??
    cliente.tipoIdentificacion

  return (
    <section className="tarjeta">
      <dl className="rejilla-detalle">
        <dt>Identificación</dt>
        <dd>{cliente.identificacion}</dd>
        <dt>Tipo de identificación</dt>
        <dd>{tipoIdentificacion}</dd>
        <dt>Nombres</dt>
        <dd>{cliente.nombres}</dd>
        <dt>Apellidos</dt>
        <dd>{cliente.apellidos}</dd>
        <dt>Fecha de nacimiento</dt>
        <dd>{formatearFecha(cliente.fechaNacimiento)}</dd>
        <dt>Celular</dt>
        <dd>{cliente.numeroCelular}</dd>
        <dt>Correo</dt>
        <dd>{cliente.correoElectronico}</dd>
      </dl>
      <h3>Servicios contratados</h3>
      {cliente.servicios.length > 0 ? (
        <Table
          columnas={columnasServicios}
          datos={cliente.servicios}
          obtenerClave={(servicio) => servicio.servicio}
          mensajeVacio="Este cliente no tiene servicios contratados."
        />
      ) : (
        <p className="texto-secundario">Este cliente no tiene servicios contratados.</p>
      )}
    </section>
  )
}
