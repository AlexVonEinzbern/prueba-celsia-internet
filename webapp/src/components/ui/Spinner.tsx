export interface SpinnerProps {
  etiqueta?: string
}

export function Spinner({ etiqueta }: SpinnerProps) {
  return (
    <span className="spinner" role="status">
      <span className="spinner__rueda" aria-hidden="true" />
      {etiqueta ? (
        <span className="spinner__etiqueta">{etiqueta}</span>
      ) : (
        <span className="sr-only">Cargando</span>
      )}
    </span>
  )
}
