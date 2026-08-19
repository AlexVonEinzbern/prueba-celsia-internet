export const TIPO_IDENTIFICACION_VALUES = ['CC', 'TI', 'CE', 'RC'] as const

export type TipoIdentificacion = (typeof TIPO_IDENTIFICACION_VALUES)[number]

export const TIPOS_IDENTIFICACION: readonly { value: TipoIdentificacion; label: string }[] = [
  { value: 'CC', label: 'Cédula' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'RC', label: 'Registro civil' },
]
