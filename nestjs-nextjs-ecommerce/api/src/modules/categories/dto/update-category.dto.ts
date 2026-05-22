// DTO for category update response that is back to the client
import { PartialType } from '@nestjs/mapped-types'; // automatically makes all properties of create category DT optional ;
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
