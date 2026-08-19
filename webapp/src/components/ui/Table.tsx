import type { ReactNode } from 'react'

export interface Columna<T> {
  encabezado: string
  render: (fila: T) => ReactNode
}

export interface TableProps<T> {
  columnas: Columna<T>[]
  datos: T[]
  obtenerClave: (fila: T) => string
  mensajeVacio: string
}

export function Table<T>({ columnas, datos, obtenerClave, mensajeVacio }: TableProps<T>) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.encabezado} scope="col">
                {columna.encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.length === 0 ? (
            <tr>
              <td className="tabla__vacia" colSpan={columnas.length}>
                {mensajeVacio}
              </td>
            </tr>
          ) : (
            datos.map((fila) => (
              <tr key={obtenerClave(fila)}>
                {columnas.map((columna) => (
                  <td key={columna.encabezado}>{columna.render(fila)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
