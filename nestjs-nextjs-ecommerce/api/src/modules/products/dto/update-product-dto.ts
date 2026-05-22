// DTO for updating on the existing product
import { PartialType } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';
export class UpdateProductDto extends PartialType(ProductResponseDto) {}
