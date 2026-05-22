// DTO for creating a new product
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  // name
  @ApiProperty({
    description: 'Product Name',
    example: 'Apple iPhone 14 Pro Max',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  // description
  @ApiProperty({
    description: 'Product Description',
    example:
      'The latest iPhone model with advanced features and improved performance.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // price
  @ApiProperty({
    description: 'Product Price in USD',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Type(() => Number)
  price: number;

  // stock
  @ApiProperty({
    description: 'Stock Quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock: number;

  // sku
  @ApiProperty({
    description: 'Stock Keeping Unit (SKU) - unique identifier',
    example: 'WH-001',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  // imageUrl
  @ApiProperty({
    description: 'Product Image URL',
    example: 'https://example.com/images/product.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  // product category
  @ApiProperty({
    description: 'product category',
    example: 'Electronics',
    required: true,
  })
  @IsString()
  @IsOptional()
  categoryId: string;

  // isActive
  @ApiProperty({
    description:
      'Whether or not the product is active and available for purchase',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
