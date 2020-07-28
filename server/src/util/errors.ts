import createError from 'http-errors'
import httpStatus from 'http-status-codes'

export default {
  err400(message?: string) {
    return createError(message || httpStatus.BAD_REQUEST, httpStatus.getStatusText(httpStatus.BAD_REQUEST))
  },
  err401(message?: string) {
    return createError(message || httpStatus.UNAUTHORIZED, httpStatus.getStatusText(httpStatus.UNAUTHORIZED))
  },
  err403(message?: string) {
    return createError(message || httpStatus.FORBIDDEN, httpStatus.getStatusText(httpStatus.FORBIDDEN))
  },
  err404(message?: string) {
    return createError(message || httpStatus.NOT_FOUND, httpStatus.getStatusText(httpStatus.NOT_FOUND))
  },
}
