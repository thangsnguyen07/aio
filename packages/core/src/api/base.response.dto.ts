import { ApiProperty } from '@nestjs/swagger'

import { IdResponseDto } from './id.response.dto'

export interface BaseResponseProps {
  id: string
  createdAt: Date
  updatedAt: Date
}

export class BaseResponseDto extends IdResponseDto {
  constructor(props: BaseResponseProps) {
    super(props.id)
    this.createdAt = new Date(props.createdAt).toISOString()
    this.updatedAt = new Date(props.updatedAt).toISOString()
  }

  @ApiProperty({ example: '2024-11-19T17:43:15.970Z' })
  readonly createdAt: string

  @ApiProperty({ example: '2024-11-19T17:43:15.970Z' })
  readonly updatedAt: string
}
