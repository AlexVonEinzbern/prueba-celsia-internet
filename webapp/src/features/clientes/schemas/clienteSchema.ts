import { z } from 'zod'
import { TIPO_IDENTIFICACION_VALUES } from '../../../constants/tiposIdentificacion'
import { esFechaValida } from '../../../lib/utils/dates'

const campoTexto = (mensajeObligatorio: string, maximo: number) =>
  z
    .string()
    .trim()
    .min(1, mensajeObligatorio)
    .max(maximo, `No puede superar ${maximo} caracteres`)

export const clienteSchema = z.object({
  identificacion: campoTexto('La identificación es obligatoria', 20),
  nombres: campoTexto('Los nombres son obligatorios', 80),
  apellidos: campoTexto('Los apellidos son obligatorios', 80),
  tipoIdentificacion: z.enum(TIPO_IDENTIFICACION_VALUES, {
    message: 'Selecciona un tipo de identificación válido',
  }),
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine(esFechaValida, 'Ingresa una fecha válida'),
  numeroCelular: campoTexto('El número de celular es obligatorio', 20),
  correoElectronico: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .max(80, 'No puede superar 80 caracteres')
    .pipe(z.email('Ingresa un correo electrónico válido')),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>
