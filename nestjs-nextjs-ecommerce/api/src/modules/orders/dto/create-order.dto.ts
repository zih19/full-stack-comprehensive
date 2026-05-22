// DTO for creating an order
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';

// -> represent the single item in the order
class OrderItemDto {
  @ApiProperty({
    description: 'The ID of the product being ordered',
    example: 'prod_12345',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product being ordered',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The price of the product at the time of order',
    example: 19.99,
  })
  @IsNotEmpty()
  @IsNumber(
    {
      maxDecimalPlaces: 2, // ensure the price has at most 2 decimal places
    },
    { message: 'Price must be a valid number (e.g. 49.99)' },
  )
  @Type(() => Number) //transforms the input to a number
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'All items consiered',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true }) // validate each item in the array using the OrderItemDto class
  @Type(() => OrderItemDto) // transform each item in the array to an instance of OrderItemDto
  items: OrderItemDto[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  shippingAddress: string;
}
