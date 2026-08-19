import { useId } from 'react'
import type { Ref, SelectHTMLAttributes } from 'react'

export interface OpcionSelect {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  opciones: readonly OpcionSelect[]
  placeholder?: string
  ref?: Ref<HTMLSelectElement>
}

export function Select({
  label,
  error,
  opciones,
  placeholder = 'Seleccione una opción',
  id,
  className,
  ...rest
}: SelectProps) {
  const idAutomatico = useId()
  const selectId = id ?? idAutomatico
  const errorId = `${selectId}-error`
  const clasesEnvoltura = ['campo', className].filter(Boolean).join(' ')
  return (
    <div className={clasesEnvoltura}>
      <label className="campo__label" htmlFor={selectId}>
        {label}
      </label>
      <select
        id={selectId}
        className="campo__control campo__control--select"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="campo__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
