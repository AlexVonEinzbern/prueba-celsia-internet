import type { ReactNode } from 'react'

export interface PageContainerProps {
  titulo: string
  descripcion?: string
  acciones?: ReactNode
  children: ReactNode
}

export function PageContainer({ titulo, descripcion, acciones, children }: PageContainerProps) {
  return (
    <main className="pagina">
      <header className="pagina__encabezado">
        <div className="pagina__titulos">
          <h1 className="pagina__titulo">{titulo}</h1>
          {descripcion ? <p className="pagina__descripcion texto-secundario">{descripcion}</p> : null}
        </div>
        {acciones ? <div className="pagina__acciones">{acciones}</div> : null}
      </header>
      {children}
    </main>
  )
}
