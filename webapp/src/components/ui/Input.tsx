import { useId } from 'react'
import type { InputHTMLAttributes, Ref } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, id, className, ...rest }: InputProps) {
  const idAutomatico = useId()
  const inputId = id ?? idAutomatico
  const errorId = `${inputId}-error`
  const clasesEnvoltura = ['campo', className].filter(Boolean).join(' ')
  return (
    <div className={clasesEnvoltura}>
      <label className="campo__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="campo__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error ? (
        <p className="campo__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
