// DTO for querying products, which can be extended with pagination, filtering, etc.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
export class QueryProductDto {
  // category
  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'Electronics',
  })
  @IsString()
  @IsOptional()
  category?: string;

  // isActive
  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // search
  @ApiPropertyOptional({
    description: 'Search by product name',
    example: 'headphones',
  })
  @IsString()
  @IsOptional()
  search?: string;

  // page
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number = 1;

  // limit
  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 10;
}
