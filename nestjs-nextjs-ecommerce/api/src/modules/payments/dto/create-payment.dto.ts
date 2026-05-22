import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'ID of the order associated with the payment intent',
    example: 'order-123',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Amount to be charged for the order',
    example: 99.99,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency for the payment (default: USD)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'usd';

  @ApiProperty({
    description: 'Optional description for the payment intent',
    example: 'Payment for order #123',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({
    description:
      'Indicates whether the payment intent was created successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    type: CreatePaymentIntentDto,
  })
  data: CreatePaymentIntentDto;

  @ApiProperty({
    example: 'Payment intent created successfully',
    required: false,
  })
  message?: string;
}
