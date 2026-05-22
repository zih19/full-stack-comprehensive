import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto } from './dto/order-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus, OrderItem, Product, User } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 1st api logic: create a new order
  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    // Step 1: extract items and shipping address from the DTO
    const { items, shippingAddress } = createOrderDto;

    // Step 2: iterate each product in the items array
    for (const item of items) {
      const productSpecified = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!productSpecified) {
        // Not Found
        throw new NotFoundException(
          `Product with ID ${item.productId} not found!`,
        );
      }

      if (productSpecified.stock < item.quantity) {
        // Bad Request
        throw new BadRequestException(
          `Insufficient stock for product ${productSpecified.name}. Available: ${productSpecified.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Step 3: I want to compute the total amount of the order by summing up the price * quantity for each item
    const totalAmount = items.reduce((sum, item) => {
      sum += item.price * item.quantity;
      return sum;
    }, 0);

    // Step 4: find the latest cart for the user and sort it in a descending order
    const latestCart = await this.prisma.cart.findFirst({
      where: {
        userId,
        checkedOut: false, // only consider carts that have not been checked out yet
      },
      orderBy: {
        createdAt: 'desc', // sort by createdAt in descending order
      },
    });

    // step 5: create an order using transaction
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          totalAmount,
          shippingAddress,
          cartId: latestCart?.id,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true, // include the product details for each order item
            },
          },
          user: true, // include the user details for the order
        },
      });

      // Step 6: After creating the order, I want to update its product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity, // decrease the stock by the quantity ordered
            },
          },
        });
      }
      return newOrder;
    });
    return this.wrap(createdOrder);
  }

  // 2nd api logic: get all orders from the admin's perspective
  async findAllAdmin(queryOrderDto: QueryOrderDto): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = queryOrderDto;

    const skip = (page - 1) * limit; // How many records can we offset in total for pagination

    const where: any = {};

    if (status) {
      // The current status of the order
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } }, // search by order ID
        { orderNumber: { contains: search, mode: 'insensitive' } }, // search by order number
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: true, // include the product details for each order item
            },
          },
          user: true, // include the user details for the order
        },
        orderBy: { createdAt: 'desc' }, // The order will be sorted in a descending order.
      }),

      this.prisma.order.count({ where }), // count the total number of orders that match the filter criteria
    ]);

    // return the corresponding output
    return {
      data: orders.map((o) => this.map(o)),
      total,
      page,
      limit,
    };
  }

  // 3rd api logic: get all orders from the specified user's perspective
  async findAll(
    userId: string,
    queryOrderDto: QueryOrderDto,
  ): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = queryOrderDto;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } }, // search by order ID
        { orderNumber: { contains: search, mode: 'insensitive' } }, // search by order number
      ];
    }

    // run 2 databases in parallel using promise.all
    const [orders, total] = await Promise.all([
      // The first output: Order + orderItems
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: true, // include the product details for each order item
            },
          },
          user: true, // include the user details for the order
        },
        orderBy: { createdAt: 'desc' }, // The order will be sorted in an ascending order.
      }),

      // The second output: count the total number of items that are satisfied
      this.prisma.order.count({ where }), // count the total number of matching orders
    ]);

    // return the final output
    return {
      data: orders.map((o) => this.map(o)),
      total,
      page,
      limit,
    };
  }

  // 4th api logic: get a specific order by ID
  // -> A specified user can fetch his or her own order by userId optionally
  async findOne(
    orderId: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    // Start with orderId
    const where: any = { id: orderId };

    if (userId) {
      where.userId = userId; // only allow users to fetch their own orders
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    return this.wrap(order);
  }

  // 5th api logic: update a specific order by ID for ADMIN
  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id };

    if (userId) {
      where.userId = userId;
    }

    const existingOrder = await this.prisma.order.findFirst({
      where,
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order ${id} not found!`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return this.wrap(updatedOrder);
  }

  // 6th api logic: cancel a specific order by ID for ADMIN
  async cancelOrder(
    id: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: any = { id };

    if (userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: true,
        user: true,
      },
    });

    // Not Found
    if (!order) {
      throw new NotFoundException(`Order ${id} not found!`);
    }

    // Bad Request
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled!');
    }

    const cancelledOrder = await this.prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity, // increase the stock by the quantity in the cancelled order
            },
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
    });

    return this.wrap(cancelledOrder);
  }

  private wrap(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderApiResponseDto<OrderResponseDto> {
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: this.map(order),
    };
  }

  private map(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      shippingAddress: order.shippingAddress ?? '',
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      ...(order.user && {
        userEmail: order.user.email,
        userName:
          `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
