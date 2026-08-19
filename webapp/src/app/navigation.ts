export const SECCIONES = [
  { id: 'clientes', label: 'Clientes' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'consulta', label: 'Consulta' },
] as const

export type Seccion = (typeof SECCIONES)[number]['id']
