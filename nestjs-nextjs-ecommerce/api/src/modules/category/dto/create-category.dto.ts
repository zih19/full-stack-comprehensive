// DTO for creating a specified category
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'The category name must not be empty!' })
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'A brief description of the category',
    example: 'Devices and gadgets including phones, laptops, and accessories',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    example: 'electronics',
    description: 'A URL-friendly slug for this category',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string;

  @ApiProperty({
    description: 'The URL of the category image',
    example: 'https://example.com/images/electronics.jpg',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;

  @ApiProperty({
    description: 'Indicates if the current category is active or not',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // Optional field to indicate if the category is active, default is true
}
