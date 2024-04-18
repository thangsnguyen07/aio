import { ApiProperty } from '@nestjs/swagger'

export class ApiErrorResponse {
  @ApiProperty({ example: 400 })
  readonly statusCode: number

  @ApiProperty({ example: 'Validation Error' })
  readonly message: string

  @ApiProperty({ example: 'Bad Request' })
  readonly error: string

  @ApiProperty({ example: '0b95f466-fc3b-44ea-bd5a-f48073915a01' })
  readonly correlationId: string

  @ApiProperty({
    example: ['incorrect email'],
    description: 'Optional list of sub-errors',
    nullable: true,
    required: false,
  })
  readonly subErrors?: string[]

  constructor(body: ApiErrorResponse) {
    this.correlationId = body.correlationId
    this.statusCode = body.statusCode
    this.message = body.message
    this.error = body.error
    this.subErrors = body.subErrors
  }
}
