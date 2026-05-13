// DTO for category response
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'the unique identifier of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'the name of the category',
    example: 'Electronics',
  })
  name: string;

  @ApiProperty({
    description: 'a brief description of the category',
    example: 'Devices and gadgets including phones, laptops, and accessories',
    nullable: true,
  })
  description: string | null; // It can be optional or null

  @ApiProperty({
    description: 'the URL-friendly slug for this category',
    example: 'electronics',
    nullable: true,
  })
  slug: string | null; // It can be optional or null

  @ApiProperty({
    description: 'the URL of the category image',
    example: 'https://example.com/images/electronics.jpg',
    nullable: true,
  })
  imageUrl: string | null; // It can be optional or null

  @ApiProperty({
    description: 'Indicates if the current category is active or not',
    example: true,
  })
  isActive: boolean; // the active status of the category

  @ApiProperty({
    description: 'Number of products in this category',
    example: 150,
  })
  productCount: number;

  @ApiProperty({
    description: 'the date and time when the category was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'the date and time when the category was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
