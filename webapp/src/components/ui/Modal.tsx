import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'

export interface ModalProps {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
}

export function Modal({ abierto, titulo, onCerrar, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const tituloId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (abierto && !dialog.open) {
      dialog.showModal()
    } else if (!abierto && dialog.open) {
      dialog.close()
    }
  }, [abierto])

  const manejarClickFondo = (evento: MouseEvent<HTMLDialogElement>) => {
    if (evento.target === dialogRef.current) {
      onCerrar()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby={tituloId}
      onClose={onCerrar}
      onClick={manejarClickFondo}
    >
      <div className="modal__panel">
        <header className="modal__encabezado">
          <h2 className="modal__titulo" id={tituloId}>
            {titulo}
          </h2>
          <button type="button" className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </dialog>
  )
}
