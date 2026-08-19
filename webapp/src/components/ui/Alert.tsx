import type { ReactNode } from 'react'

export type VarianteAlerta = 'exito' | 'error' | 'info'

export interface AlertProps {
  variante: VarianteAlerta
  children: ReactNode
  onCerrar?: () => void
}

export function Alert({ variante, children, onCerrar }: AlertProps) {
  return (
    <div className={`alerta alerta--${variante}`} role="alert">
      <div className="alerta__contenido">{children}</div>
      {onCerrar ? (
        <button type="button" className="alerta__cerrar" onClick={onCerrar} aria-label="Cerrar alerta">
          ×
        </button>
      ) : null}
    </div>
  )
}
