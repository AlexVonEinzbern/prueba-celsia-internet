import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { SERVICIOS } from '../../../constants/servicios'
import type { ServicioNombre } from '../../../constants/servicios'
import { toApiError } from '../../../lib/api/errors'
import { servicioSchema } from '../schemas/servicioSchema'
import type { ServicioFormValues } from '../schemas/servicioSchema'
import type { Servicio } from '../types/servicio'

interface ServicioFormProps {
  valoresIniciales?: Servicio
  enEdicion: boolean
  onSubmit: (values: ServicioFormValues) => Promise<void>
  onCancelar: () => void
}

/** Formulario de contratación/edición de un servicio. */
export function ServicioForm({
  valoresIniciales,
  enEdicion,
  onSubmit,
  onCancelar,
}: ServicioFormProps) {
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicioFormValues>({
    resolver: zodResolver(servicioSchema),
    defaultValues: valoresIniciales
      ? {
          servicio: valoresIniciales.servicio,
          fechaInicio: valoresIniciales.fechaInicio,
          ultimaFacturacion: valoresIniciales.ultimaFacturacion,
          ultimoPago: valoresIniciales.ultimoPago,
        }
      // Centinela "sin seleccionar": muestra el placeholder del Select y
      // Zod lo rechaza al enviar. Sin esto el navegador preselecciona una opción.
      : { servicio: '' as ServicioNombre, fechaInicio: '', ultimaFacturacion: '' },
  })

  async function manejarSubmit(values: ServicioFormValues): Promise<void> {
    setErrorServidor(null)
    try {
      await onSubmit(values)
    } catch (e) {
      setErrorServidor(toApiError(e).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(manejarSubmit)} noValidate>
      {errorServidor && <Alert variante="error">{errorServidor}</Alert>}
      {enEdicion ? (
        // readOnly en lugar de disabled: RHF excluye los controles disabled del envío.
        <Input label="Servicio" readOnly {...register('servicio')} />
      ) : (
        <Select
          label="Servicio"
          opciones={SERVICIOS}
          placeholder="Selecciona un servicio"
          error={errors.servicio?.message}
          {...register('servicio')}
        />
      )}
      <Input
        label="Fecha de inicio"
        type="date"
        error={errors.fechaInicio?.message}
        {...register('fechaInicio')}
      />
      <Input
        label="Última facturación"
        type="date"
        error={errors.ultimaFacturacion?.message}
        {...register('ultimaFacturacion')}
      />
      <Input
        label="Último pago"
        type="number"
        min={0}
        step="1"
        error={errors.ultimoPago?.message}
        {...register('ultimoPago', { valueAsNumber: true })}
      />
      <div className="fila-acciones">
        <Button type="submit" variante="primario" cargando={isSubmitting}>
          Guardar
        </Button>
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
