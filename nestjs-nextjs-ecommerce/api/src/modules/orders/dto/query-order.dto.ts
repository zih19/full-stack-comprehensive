import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class QueryOrderDto {
  // Page
  @ApiProperty({
    description: 'the number pages',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1; // default to page 1 if not provided

  // Limit
  @ApiProperty({
    description: 'the number of items to return per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  // Status
  @ApiProperty({
    description: 'the status of the order to filter by',
    example: 'PENDING',
    enum: OrderStatus,
  })
  @IsOptional()
  @Type(() => String)
  status?: OrderStatus;

  // Search
  @ApiProperty({
    description:
      'a search term to filter orders by user ID or shipping address',
    example: 'user_12345 or 123 Main St',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
