/** Valida una fecha en formato ISO `AAAA-MM-DD` (la que producen los input[type=date]). */
export function esFechaValida(valor: string): boolean {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor)
  if (!coincidencia) return false
  const [, anio, mes, dia] = coincidencia
  const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia))
  return (
    fecha.getFullYear() === Number(anio) &&
    fecha.getMonth() === Number(mes) - 1 &&
    fecha.getDate() === Number(dia)
  )
}
