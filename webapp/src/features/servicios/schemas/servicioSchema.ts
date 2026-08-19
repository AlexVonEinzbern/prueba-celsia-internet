import { z } from 'zod'
import { SERVICIO_VALUES } from '../../../constants/servicios'
import { esFechaValida } from '../../../lib/utils/dates'

const fechaObligatoria = (campo: string) =>
  z
    .string()
    .min(1, `${campo} es obligatoria`)
    .refine(esFechaValida, 'Ingresa una fecha válida')

export const servicioSchema = z.object({
  servicio: z.enum(SERVICIO_VALUES, {
    message: 'Selecciona un servicio válido',
  }),
  fechaInicio: fechaObligatoria('La fecha de inicio'),
  ultimaFacturacion: fechaObligatoria('La última facturación'),
  ultimoPago: z
    .number({ message: 'El último pago es obligatorio' })
    .int('El último pago debe ser un número entero')
    .min(0, 'El último pago no puede ser negativo'),
})

export type ServicioFormValues = z.infer<typeof servicioSchema>
