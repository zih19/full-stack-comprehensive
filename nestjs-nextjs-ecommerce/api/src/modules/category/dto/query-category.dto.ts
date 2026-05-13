// DTO for querying categories with filtering, search, and pagination options
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class QueryCategoryDto {
  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined; // If the value is not a valid boolean, return undefined to ignore the filter
  }) // converts query strings to boolean values
  @IsBoolean()
  @IsOptional() // makes the filter optional
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search term to filter categories by name or description',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  search?: string; // an optional text filter for category name

  @ApiPropertyOptional({
    description: 'Page number for pagination (default: 1',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number) // converts query strings to numbers
  @IsNumber()
  @Min(1)
  @IsOptional() // makes pagination optional
  page = 1; // Only one page is considered.

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @Type(() => Number) // converts query strings to numbers
  @IsNumber()
  @Min(1)
  @IsOptional() // makes pagination optional
  limit = 10;
}
