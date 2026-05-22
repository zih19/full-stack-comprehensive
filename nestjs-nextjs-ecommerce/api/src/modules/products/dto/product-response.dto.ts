import { ApiProperty } from '@nestjs/swagger';
export class ProductResponseDto {
  // id
  @ApiProperty({
    description: 'Product ID',
    example: '465b8c9e-1a2b-4d3f-9e8a-7c6d5e4f3a2b',
  })
  id: string;

  // name
  @ApiProperty({
    description: 'Product Name',
    example: 'Apple iPhone 14 Pro Max',
  })
  name: string;

  // description
  @ApiProperty({
    description: 'Product Description',
    example:
      'The latest iPhone model with advanced features and improved performance.',
    required: false,
  })
  description: string | null;

  // price
  @ApiProperty({
    description: 'Product Price in USD',
    example: 99.99,
  })
  price: number;

  // stock
  @ApiProperty({
    description: 'Stock Quantity',
    example: 100,
  })
  stock: number;

  // sku
  @ApiProperty({
    description: 'Stock Keeping Unit (SKU) - unique identifier',
    example: 'WH-001',
  })
  sku: string;

  // imageUrl
  @ApiProperty({
    description: 'Product Image URL',
    example: 'https://example.com/images/product.jpg',
  })
  imageURL: string | null;

  // category
  @ApiProperty({
    description: 'Product Category',
    example: 'Electronics',
  })
  category: string | null;

  // isActive
  @ApiProperty({
    description: 'Product Availability Status',
    example: true,
  })
  isActive: boolean;

  // createdAt
  @ApiProperty({
    description: 'Product Creation Timestamp',
  })
  createdAt: Date;

  // updatedAt
  @ApiProperty({
    description: 'Product Last Update Timestamp',
  })
  updatedAt: Date;
}
