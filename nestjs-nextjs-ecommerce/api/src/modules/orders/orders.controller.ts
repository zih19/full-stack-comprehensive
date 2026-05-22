import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiQuery,
  ApiResponse,
  ApiForbiddenResponse,
  getSchemaPath,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ModerateThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { RelaxedThrottle } from 'src/common/decorators/custom-throttler.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderApiResponseDto } from './dto/order-response.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { PaginatedOrderResponseDto } from './dto/order-response.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1st controller endpoint: create a new order
  @Post()
  @ModerateThrottle() // limit the number of requests to create an order to prevent abuse
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiCreatedResponse({
    description: 'Order has been created successfully',
    type: OrderApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data or insufficient stock',
  })
  @ApiNotFoundResponse({
    description: 'Cart not found or empty!',
  })
  @ApiTooManyRequestsResponse({
    description: 'Too many requests - rate limit exceeded',
  })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.createOrder(userId, createOrderDto);
  }

  // 2nd controller endpoint: get all orders for the authenticated user
  @Get('admin/all')
  @Roles(Role.ADMIN) // only allow admin users to access this endpoint
  @RelaxedThrottle() // allow more requests for admin users
  @ApiOperation({
    summary: '[ADMIN] Get all orders (Paginated)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    description: 'List of data',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(OrderResponseDto) },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async findAllAdmin(@Query() queryOrderDto: QueryOrderDto) {
    return await this.ordersService.findAllAdmin(queryOrderDto);
  }

  // 3rd controller endpoint: get all orders for a particular authenticated user
  @Get()
  @RelaxedThrottle() // allow more requests for authenticated users
  @ApiOperation({
    summary: 'Get all orders for the current users (Paginated)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
  })
  @ApiOkResponse({
    description: 'List of user order',
    type: PaginatedOrderResponseDto,
  })
  async findAll(
    @Query() queryOrderDto: QueryOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.findAll(userId, queryOrderDto);
  }

  // 4th controller endpoint: get a specific order by ID for ADMIN
  @Get('admin/:id')
  @Roles(Role.ADMIN) // only allow admin users to access this endpoint
  @RelaxedThrottle() // allow more requests for admin users
  @ApiOperation({
    summary: '[ADMIN]: Get a specific order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'the unique identifier of the order',
  })
  @ApiOkResponse({
    description: 'The order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async findOneAdmin(@Param('id') orderId: string) {
    return await this.ordersService.findOne(orderId);
  }

  // 5th controller endpoint: get a specific order by ID for USER
  @Get(':id')
  @RelaxedThrottle() // allow more requests for authenticated users
  @ApiOperation({
    summary: 'Get a specific order by ID for the current user',
  })
  @ApiParam({
    name: 'id',
    description: 'the unique identifier of the order',
  })
  @ApiOkResponse({
    description: 'The order details',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async findOne(
    @Param('id') orderId: string,
    @GetUser('id') userId: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    return await this.ordersService.findOne(orderId, userId);
  }

  // 6th controller endpoint: update a specific order by ID for ADMIN
  @Patch('admin/:id')
  @Roles(Role.ADMIN) // only allow admin users to access this endpoint
  @ModerateThrottle() // limit the number of requests to update an order to prevent abuse
  @ApiOperation({
    summary: '[ADMIN] update a specific order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({
    type: UpdateOrderDto, // define the shape and validation rules for updating an order
  })
  @ApiOkResponse({
    description: 'The order has been updated successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async updateOrderAdmin(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrder(id, updateOrderDto);
  }

  // 7th controller endpoint: update a specific order by ID for USER
  @Patch(':id')
  @ModerateThrottle() // limit the number of requests to update an order to prevent abuse
  @ApiOperation({
    summary: 'update a specific order by ID for the current user',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiBody({
    type: UpdateOrderDto, // define the shape and validation rules for updating an order
  })
  @ApiOkResponse({
    description: 'The order has been updated successfully',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async updateOrderUser(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.updateOrder(id, updateOrderDto, userId);
  }

  // 8th controller endpoint: delete a specific order by ID for ADMIN
  @Delete('/admin/:id')
  @Roles(Role.ADMIN) // only allow admin users to access this endpoint
  @ModerateThrottle() // limit the number of requests to delete an  order to prevent abuse
  @ApiOperation({
    summary: '[ADMIN] Cancel Order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order Cancelled!',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  @ApiForbiddenResponse({
    description: 'Admin access required',
  })
  async cancelOrderAdmin(@Param('id') id: string) {
    return await this.ordersService.cancelOrder(id);
  }

  // 9th controller endpoint: delete a specific order by ID for USER
  @Delete(':id')
  @ModerateThrottle() // limit the number of requests to delete an order to prevent abuse
  @ApiOperation({
    summary: 'Cancel Order by ID for the current user',
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
  })
  @ApiOkResponse({
    description: 'Order Cancelled!',
    type: OrderApiResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
  })
  async cancelOrderUser(
    @Param('id') id: string,
    @GetUser('id') userId: string,
  ) {
    return await this.ordersService.cancelOrder(id, userId);
  }
}
