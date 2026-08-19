import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'

interface ConsultaFormProps {
  cargando: boolean
  onConsultar: (identificacion: string) => void
}

/** Formulario de consulta de cliente por número de identificación. */
export function ConsultaForm({ cargando, onConsultar }: ConsultaFormProps) {
  const [identificacion, setIdentificacion] = useState('')
  const [error, setError] = useState<string | null>(null)

  function manejarSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const valor = identificacion.trim()
    if (!valor) {
      setError('Ingresa un número de identificación.')
      return
    }
    setError(null)
    onConsultar(valor)
  }

  return (
    <form className="barra-consulta" onSubmit={manejarSubmit} noValidate>
      <Input
        label="Identificación"
        value={identificacion}
        error={error ?? undefined}
        onChange={(e) => setIdentificacion(e.target.value)}
      />
      <Button type="submit" variante="primario" cargando={cargando}>
        Buscar
      </Button>
    </form>
  )
}
