export const SERVICIO_VALUES = [
  'Internet 200 MB',
  'Internet 400 MB',
  'Internet 600 MB',
  'Directv Go',
  'Paramount+',
  'Win+',
] as const

export type ServicioNombre = (typeof SERVICIO_VALUES)[number]

export const SERVICIOS: readonly { value: ServicioNombre; label: string }[] =
  SERVICIO_VALUES.map((value) => ({ value, label: value }))
