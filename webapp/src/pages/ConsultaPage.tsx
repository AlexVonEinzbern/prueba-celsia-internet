import { PageContainer } from '../components/layout/PageContainer'
import { Alert } from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import { ClienteDetalle } from '../features/consulta/components/ClienteDetalle'
import { ConsultaForm } from '../features/consulta/components/ConsultaForm'
import { useConsulta } from '../features/consulta/hooks/useConsulta'

/** Página de consulta de un cliente por su número de identificación. */
export function ConsultaPage() {
  const { cliente, cargando, error, consultar } = useConsulta()

  return (
    <PageContainer
      titulo="Consulta de cliente"
      descripcion="Consulta los datos y servicios de un cliente por su identificación."
    >
      <ConsultaForm cargando={cargando} onConsultar={(id) => void consultar(id)} />
      {cargando ? (
        <Spinner etiqueta="Consultando cliente..." />
      ) : error ? (
        <Alert variante="error">{error}</Alert>
      ) : cliente ? (
        <ClienteDetalle cliente={cliente} />
      ) : (
        <p className="texto-secundario">
          Ingresa un número de identificación para consultar.
        </p>
      )}
    </PageContainer>
  )
}
