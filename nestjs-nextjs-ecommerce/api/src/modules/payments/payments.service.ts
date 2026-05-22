import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private stripe: StripeType;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    });
  }

  // 1st logic: create a payment intent for the order
  async createPaymentIntent(
    userId: string,
    createPaymentIntentDto: CreatePaymentIntentDto,
  ): Promise<{
    success: boolean;
    data: {
      clientSecret: string;
      paymentId: string;
    };
    message: string;
  }> {
    // Step 1: extract all those fields from createPaymentIntentDto for determining
    // whether the user exists
    const { orderId, amount, currency = 'usd' } = createPaymentIntentDto;

    // Step 2: Search for the existing order to prevent duplicate charges
    const orderRecord = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!orderRecord) {
      throw new NotFoundException(`Order with ${orderId} not found!`);
    }

    // Step 3: check whether or not the paymeny already exists.
    const existingPayment = await this.prisma.payment.findFirst({
      where: { orderId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException(
        'Payment already completed for this order!',
      );
    }

    // paymentIntent: guide you through the process fo collecing a payment from your customer
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        orderId,
        userId,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        paymentMethod: 'STRIPE',
        transactionId: paymentIntent.id,
      },
    });

    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret!,
        paymentId: payment.id,
      },
      message: 'Payment intent created successfully',
    };
  }

  // 2nd logic: confirm the payment intent for the order
  async confirmPaymentIntent(
    userId: string,
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    // Step 1: extract both the paymentIntentId and orderId
    const { paymentIntentId, orderId } = confirmPaymentDto;

    // Step 2: identify the payment record
    // -> Not Found: NotFoundException
    // -> Payment Completed: BadRequestException
    const paymentRecord = await this.prisma.payment.findFirst({
      where: {
        orderId,
        userId,
        transactionId: paymentIntentId,
      },
    });

    if (!paymentRecord) {
      throw new NotFoundException('Payment not found');
    }

    if (paymentRecord.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment already completed');
    }

    // Step 3: retrieve the payment intent from Stripe
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not successful!');
    }

    // Step 4: update the payment record in the database
    const [updatedPayment] = await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: PaymentStatus.COMPLETED,
        },
      }),

      this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING',
        },
      }),
    ]);

    // Step 4: find the order
    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order?.cartId) {
      await this.prisma.cart.update({
        where: { id: order.cartId },
        data: { checkedOut: true },
      });
    }

    // step 5: return the order
    return {
      success: true,
      data: this.mapToPaymentResponse(updatedPayment),
      message: 'Payment confirmed successfully',
    };
  }

  // 3rd logic: find all payments for the current user
  async findAll(userId: string): Promise<{
    success: boolean;
    data: PaymentResponseDto[];
    message: string;
  }> {
    // I want to extract all payment details for the current user
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // return the result
    return {
      success: true,
      data: payments.map((specifiedPayment) =>
        this.mapToPaymentResponse(specifiedPayment),
      ),
      message: 'Payments retrieved successfully',
    };
  }

  // 4th logic: find a specific payment for a user based on its own payment id
  async findOne(
    userId: string,
    id: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return {
      success: true,
      data: this.mapToPaymentResponse(payment),
      message: 'Payment retrieved successfully',
    };
  }

  // 5th logic: find a specific payment for a user based on the order id
  async findByOrderId(
    userId: string,
    orderId: string,
  ): Promise<{
    success: boolean;
    data: PaymentResponseDto | null;
    message: string;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { userId, orderId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment for order ${orderId} not found`);
    }

    return {
      success: true,
      data: payment ? this.mapToPaymentResponse(payment) : null,
      message: 'Payment retrieved successfully',
    };
  }

  private mapToPaymentResponse(payment: {
    id: string;
    orderId: string;
    userId: string;
    amount: Prisma.Decimal;
    currency: string;
    status: PaymentStatus;
    paymentMethod: string | null;
    transactionId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentResponseDto {
    // return the whole object
    return {
      id: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
      currency: payment.currency,
      amount: payment.amount.toNumber(),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
