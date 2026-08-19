/** Formatea una fecha ISO `AAAA-MM-DD` como `DD/MM/AAAA` sin problemas de zona horaria. */
export function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split('-')
  if (!anio || !mes || !dia) return iso
  return `${dia}/${mes}/${anio}`
}

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatearMoneda(valor: number): string {
  return formatoMoneda.format(valor)
}
