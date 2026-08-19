/**
 * Error normalizado de la API.
 * `status` es null cuando el fallo es de red (no hubo respuesta HTTP).
 */
export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const MENSAJE_DUPLICADO = 'El registro ya existe'
const MENSAJE_RED = 'No fue posible conectarse con el servidor. Verifica que la API esté disponible.'
const MENSAJE_SERVIDOR = 'Error interno del servidor. Inténtalo de nuevo más tarde.'

/** Detalles de la API que indican un registro duplicado (la API responde 400, no 409). */
const DETALLES_DUPLICADO = ['ya se encuentra registrado', 'ya tiene contratado']

interface ValidationErrorItem {
  loc: (string | number)[]
  msg: string
}

function esDuplicado(detail: string): boolean {
  const normalizado = detail.toLowerCase()
  return DETALLES_DUPLICADO.some((patron) => normalizado.includes(patron))
}

function extraerDetail(body: unknown): unknown {
  if (body && typeof body === 'object' && 'detail' in body) {
    return body.detail
  }
  return null
}

function esErroresValidacion(detail: unknown): detail is ValidationErrorItem[] {
  return (
    Array.isArray(detail) &&
    detail.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        'loc' in item &&
        'msg' in item &&
        Array.isArray(item.loc) &&
        typeof item.msg === 'string',
    )
  )
}

function mensajeValidacion(detail: ValidationErrorItem[]): string {
  return detail
    .slice(0, 3)
    .map((item) => {
      const campo = item.loc.filter((parte) => parte !== 'body').join('.')
      return campo ? `${campo}: ${item.msg}` : item.msg
    })
    .join(' | ')
}

/** Construye un ApiError a partir de una respuesta HTTP no exitosa. */
export async function parseApiError(response: Response): Promise<ApiError> {
  const { status } = response
  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    // Respuesta sin cuerpo JSON: se usan los mensajes por código de estado.
  }
  const detail = extraerDetail(body)

  if (status === 409) {
    return new ApiError(MENSAJE_DUPLICADO, status)
  }

  if (status === 400) {
    if (typeof detail === 'string') {
      return new ApiError(esDuplicado(detail) ? MENSAJE_DUPLICADO : detail, status)
    }
    return new ApiError('La petición no es válida.', status)
  }

  if (status === 404) {
    return new ApiError(
      typeof detail === 'string' ? detail : 'El recurso solicitado no existe.',
      status,
    )
  }

  if (status === 422) {
    if (esErroresValidacion(detail)) {
      return new ApiError(mensajeValidacion(detail), status)
    }
    return new ApiError('Los datos enviados no son válidos.', status)
  }

  if (status >= 500) {
    return new ApiError(MENSAJE_SERVIDOR, status)
  }

  if (typeof detail === 'string') {
    return new ApiError(detail, status)
  }
  return new ApiError(`Error inesperado (HTTP ${status}).`, status)
}

/** Normaliza cualquier error capturado a ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof TypeError) return new ApiError(MENSAJE_RED, null)
  return new ApiError('Ocurrió un error inesperado.', null)
}
