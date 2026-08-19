import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { TIPOS_IDENTIFICACION } from '../../../constants/tiposIdentificacion'
import type { TipoIdentificacion } from '../../../constants/tiposIdentificacion'
import { toApiError } from '../../../lib/api/errors'
import { clienteSchema } from '../schemas/clienteSchema'
import type { ClienteFormValues } from '../schemas/clienteSchema'
import type { Cliente } from '../types/cliente'

interface ClienteFormProps {
  valoresIniciales?: Cliente
  enEdicion: boolean
  onSubmit: (values: ClienteFormValues) => Promise<void>
  onCancelar: () => void
}

export function ClienteForm({
  valoresIniciales,
  enEdicion,
  onSubmit,
  onCancelar,
}: ClienteFormProps) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: valoresIniciales
      ? { ...valoresIniciales, fechaNacimiento: valoresIniciales.fechaNacimiento.slice(0, 10) }
      : {
      identificacion: '',
      nombres: '',
      apellidos: '',
      tipoIdentificacion: '' as TipoIdentificacion,
      fechaNacimiento: '',
      numeroCelular: '',
      correoElectronico: '',
    },
  })
  const { errors, isSubmitting } = formState

  const manejarEnvio = handleSubmit(async (values) => {
    setErrorServidor(null)
    try {
      await onSubmit(values)
    } catch (e) {
      setErrorServidor(toApiError(e).message)
    }
  })

  return (
    <form onSubmit={(event) => void manejarEnvio(event)} noValidate>
      {errorServidor && (
        <Alert variante="error" onCerrar={() => setErrorServidor(null)}>
          {errorServidor}
        </Alert>
      )}

      <Select
        label="Tipo de identificación"
        error={errors.tipoIdentificacion?.message}
        opciones={TIPOS_IDENTIFICACION}
        placeholder="Selecciona..."
        {...register('tipoIdentificacion')}
      />      
      <Input
        label="Identificación"
        error={errors.identificacion?.message}
        readOnly={enEdicion}
        aria-readonly={enEdicion}
        autoComplete="off"
        {...register('identificacion')}
      />
      <Input
        label="Nombres"
        error={errors.nombres?.message}
        autoComplete="given-name"
        {...register('nombres')}
      />
      <Input
        label="Apellidos"
        error={errors.apellidos?.message}
        autoComplete="family-name"
        {...register('apellidos')}
      />
      <Input
        label="Fecha de nacimiento"
        type="date"
        error={errors.fechaNacimiento?.message}
        {...register('fechaNacimiento')}
      />
      <Input
        label="Número de celular"
        type="tel"
        error={errors.numeroCelular?.message}
        autoComplete="tel"
        {...register('numeroCelular')}
      />
      <Input
        label="Correo electrónico"
        type="email"
        error={errors.correoElectronico?.message}
        autoComplete="email"
        {...register('correoElectronico')}
      />
      <div className="fila-acciones">
        <Button type="submit" variante="primario" cargando={isSubmitting}>
          Guardar
        </Button>
        <Button variante="secundario" onClick={onCancelar} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
