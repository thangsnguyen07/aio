import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

import { ErrorStatusMapper } from '@/utils/error-status.mapper'
import { ErrorResponseDto } from 'core'
import { Response } from 'express'

// import { GrpcCustomException } from '../exceptions/grpc.exception'

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GrpcExceptionFilter.name)

  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError()
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    try {
      this.logger.error(
        `gRPC Error: ${error.message}`,
        {
          code: error.code,
          details: error.details,
          metadata: error.metadata,
        },
        'GrpcExceptionFilter',
      )

      const mapper = new ErrorStatusMapper()
      const httpStatus = mapper.grpcToHttpMapper(error.code)
      const errorType = HttpStatus[httpStatus]

      // if (!error.code || !error.message) {
      //   throw new GrpcCustomException(error)
      // }

      response
        .status(httpStatus)
        .json(new ErrorResponseDto(error.details || error.message, httpStatus, errorType))
    } catch (err) {
      this.logger.error(
        `Unexpected error in GrpcExceptionFilter: ${err.message}`,
        err.stack,
        'GrpcExceptionFilter',
      )

      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponseDto(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
            'INTERNAL_SERVER_ERROR',
          ),
        )
    }
  }
}
