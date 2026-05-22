// DTO for order response
import { ApiProperty } from '@nestjs/swagger';
export class OrderApiResponseDto<T> {
  @ApiProperty({
    description: 'indicates if the request was successful or not',
  })
  success: boolean;

  @ApiProperty({
    description: 'Returned data',
    type: Object,
  })
  data: T;

  @ApiProperty({
    description: 'Optional Message',
    nullable: true,
    required: false,
  })
  message: string;
}

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'the unique identifier for the order item',
  })
  id: string;

  @ApiProperty({
    description: 'The id associated with the current product',
  })
  productId: string;

  @ApiProperty({
    description: 'The name of the product at the time of order',
  })
  productName: string;

  @ApiProperty({
    description: 'The number of units for this product in this order',
  })
  quantity: number;

  @ApiProperty({
    description: 'The price of the unit for this product',
  })
  price: number;

  @ApiProperty({
    description: 'The total price for this item',
  })
  subtotal: number;

  @ApiProperty({
    description: 'the timestamp when the order item was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'the timestamp when the order item was last updated',
  })
  updatedAt: Date;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the order',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the user who placed the order',
  })
  userId: string;

  @ApiProperty({
    description: 'The current status of the order',
  })
  status: string;

  @ApiProperty({
    description: 'The total amount for the order',
  })
  totalAmount: number;

  @ApiProperty({
    description: 'The shipping address associated with the order item',
  })
  shippingAddress: string;

  @ApiProperty({
    description: 'The product item including quantity and price',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({
    description: 'the timestamp when the order was created',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'the timestamp when the order was last updated',
  })
  updatedAt: Date;
}

export class PaginatedOrderResponseDto {
  @ApiProperty({
    type: [OrderResponseDto],
  })
  data: OrderResponseDto[];

  @ApiProperty({})
  total: number;

  @ApiProperty({})
  limit: number;

  @ApiProperty({})
  page: number;
}
