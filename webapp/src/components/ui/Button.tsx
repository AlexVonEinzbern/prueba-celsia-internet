import type { ButtonHTMLAttributes, Ref } from 'react'
import { Spinner } from './Spinner'

export type VarianteBoton = 'primario' | 'secundario' | 'peligro' | 'fantasma'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton
  cargando?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variante = 'primario',
  cargando = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const clases = ['btn', `btn--${variante}`, className].filter(Boolean).join(' ')
  return (
    <button
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...rest}
    >
      {cargando ? <Spinner /> : null}
      {children}
    </button>
  )
}
