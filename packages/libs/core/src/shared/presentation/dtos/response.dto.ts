import { HttpStatus } from '@nestjs/common'

export class SuccessResponseDto<T> {
  statusCode: number
  message: string
  data: T

  constructor(data: T, statusCode: number = HttpStatus.OK, message: string = 'Success') {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }

  toJson() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    }
  }
}

export class ErrorResponseDto {
  statusCode: number
  message: string
  error: string

  constructor(statusCode: number, message: string, error: string) {
    this.statusCode = statusCode || HttpStatus.BAD_REQUEST
    this.message = message || 'Bad Request'
    this.error = error || 'BAD_REQUEST'
  }
}
