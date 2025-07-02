import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

import { getOrderDescription, getSortOrderFromQuery } from '../constants'
import { OrderObject } from '../types'

export function OrderDto(sortFields?: string[]) {
  class DynamicOrderDto {
    @Transform(({ value }) => getSortOrderFromQuery(value?.split(',') ?? [], sortFields), { toClassOnly: true })
    @IsOptional()
    @ApiPropertyOptional({ type: String, description: getOrderDescription(sortFields) })
    order?: OrderObject
  }

  return DynamicOrderDto
}
