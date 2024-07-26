import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

import { ErrorResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'

import { Response } from 'express'

import { ErrorStatusMapper } from '../utils/error-status.mapper'

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error: any = exception.getError()
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const mapper = new ErrorStatusMapper()

    const httpStatus = mapper.grpcToHttpMapper(error.code)
    const errorType = HttpStatus[httpStatus]

    response.status(httpStatus).json(new ErrorResponseDto(error.details, httpStatus, errorType))
  }
}
