import { Controller, UseGuards, Post, Body, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import {
  CreatePaymentIntentApiResponseDto,
  CreatePaymentIntentDto,
} from './dto/create-payment.dto';
import { PaymentApiResponseDto } from './dto/payment-response.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiTags('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // 1st controller endpoint: create the payment intent
  @Post('create-intent')
  @ApiOperation({
    summary: 'create payment intent',
    description: 'Create a payment intent',
  })
  @ApiCreatedResponse({
    description: 'Payment intent created successfully',
    type: CreatePaymentIntentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or order not found',
  })
  // CreatePaymentIntentDto -> defines the shape and validation rules for the request body when creating a payment intent
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.createPaymentIntent(
      userId,
      createPaymentIntentDto,
    );
  }

  // 2nd controller endpoint: confirm the payment intent
  @Post('confirm-intent')
  @ApiOperation({
    summary: 'Confirm payment',
    description: 'Confirm a payment intent for an order',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
    type: CreatePaymentIntentApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Payment not found or already completed',
  })
  async confirmPaymentIntent(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.paymentsService.confirmPaymentIntent(
      userId,
      confirmPaymentDto,
    );
  }

  // 3rd controller endpoint: retrieve payment details for all authenticated users
  @Get()
  @ApiOperation({
    summary: 'Get all payments',
    description: 'Get all payments for the current user',
  })
  @ApiOkResponse({
    description: 'Payments retrieved successfully',
    type: PaymentApiResponseDto,
  })
  async findAll(@GetUser('id') userId: string) {
    return await this.paymentsService.findAll(userId);
  }

  // 4th controller endpoint: retrieve a particular payment id from a user
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Payment ID',
    example: '216545-454-sds4s854d65',
  })
  @ApiOperation({
    summary: 'Get payment by ID',
    description: 'Get payment details by payment ID for the current user',
  })
  @ApiOkResponse({
    description: 'Payment retrieved successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return await this.paymentsService.findOne(userId, id);
  }

  // 5th controller endpoint: get the payment by order ID
  @Get('order/:orderId')
  @ApiParam({
    name: 'orderId',
    description: 'Order ID',
    example: 'order_1234567890abcdef',
  })
  @ApiOperation({
    summary: 'Get payment by order ID',
    description: 'Get payment information for a specific order',
  })
  @ApiOkResponse({
    description: 'Payment retrieved successfully',
    type: PaymentApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Payment not found',
  })
  async findByOrderId(
    @GetUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return await this.paymentsService.findByOrderId(userId, orderId);
  }
}
