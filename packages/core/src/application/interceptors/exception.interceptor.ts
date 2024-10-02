import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common'

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { ApiErrorResponse } from '../../api/api-error.response'
import { ExceptionBase } from '../../exceptions'
import { RequestContextService } from '../context/app-request.context'

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(ExceptionInterceptor.name)

  intercept(_context: ExecutionContext, next: CallHandler): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        // Logging for debugging purposes
        if (err.status >= 400 && err.status < 500) {
          this.logger.debug(`[${RequestContextService.getRequestId()}] ${err.message}`)

          const isClassValidatorError =
            Array.isArray(err?.response?.message) &&
            typeof err?.response?.error === 'string' &&
            err.status === 400
          // Transforming class-validator errors to a different format
          if (isClassValidatorError) {
            err = new BadRequestException(
              new ApiErrorResponse({
                correlationId: RequestContextService.getRequestId(),
                statusCode: err.status,
                message: 'Validation error',
                error: err?.response?.error,
                subErrors: err?.response?.message,
              }),
            )
          }
        }

        // Adding request ID to error message
        if (!err.correlationId) {
          err.correlationId = RequestContextService.getRequestId()
        }

        if (err.response) {
          err.response.correlationId = err.correlationId
        }

        return throwError(() => err)
      }),
    )
  }
}
