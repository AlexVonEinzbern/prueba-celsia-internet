import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { ClientesPage } from '../pages/ClientesPage'
import { ServiciosPage } from '../pages/ServiciosPage'
import { ConsultaPage } from '../pages/ConsultaPage'
import { SECCIONES } from './navigation'
import type { Seccion } from './navigation'

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('clientes')

  return (
    <div className="app">
      <Sidebar
        items={SECCIONES}
        activo={seccion}
        onSeleccionar={(id) => setSeccion(id as Seccion)}
      />
      <div className="app__contenido">
        <Header titulo="Celsia Internet" />
        {seccion === 'clientes' && <ClientesPage />}
        {seccion === 'servicios' && <ServiciosPage />}
        {seccion === 'consulta' && <ConsultaPage />}
      </div>
    </div>
  )
}
