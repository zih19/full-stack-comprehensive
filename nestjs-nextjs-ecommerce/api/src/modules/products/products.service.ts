import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { Prisma, Product, Category } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 1st API endpoint: create a new product
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    // Step 1: check if the product with the existing sku appears
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `Product with SKU ${createProductDto.sku} already exists.`,
      );
    }

    // Step 2: create a new product
    const newProduct = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: new Prisma.Decimal(createProductDto.price), // convert price to decimal
      },
      include: {
        category: true, // include the category info in the response
      },
    });

    // Step 3: return the created product
    return this.formatProduct(newProduct);
  }

  // 2nd API endpoint: get all products with optional filters and pagination
  async findAll(queryDto: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { category, isActive, search, page = 1, limit = 10 } = queryDto;

    const where: Prisma.ProductWhereInput = {};

    // the specified category
    if (category) {
      where.categoryId = category;
    }

    // the specified active status
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // the specified search keyword in the product name
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // count the total number of products that match the filters
    const total = await this.prisma.product.count({ where });

    // calculate total pages
    const products = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit, // choose how many products to return
      orderBy: { createdAt: 'desc' },
      include: {
        category: true, // include the category info in the response
      },
    });

    return {
      data: products.map((specifiedProduct) =>
        this.formatProduct(specifiedProduct),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 3rd API endpoint: get a product by its signle id
  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true, // include the category info in the response
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found!`);
    }

    // return the product in the specified format
    return this.formatProduct(product);
  }

  // 4th API endpoint: update a product by its single id
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found!`);
    }

    // check the sku of the product to be updated
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (skuTaken) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists.`,
        );
      }
    }

    const updatedData: any = { ...updateProductDto };

    if (updateProductDto.price !== undefined) {
      updatedData.price = new Prisma.Decimal(updateProductDto.price);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updatedData,
      include: {
        category: true, // include the category info in the response
      },
    });

    return this.formatProduct(updatedProduct);
  }

  // 5th API endpoint: update the product stock
  async updateProductByStock(
    id: string,
    stock: number,
  ): Promise<ProductResponseDto> {
    // Step 1: check if the product exists by the specified id
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} is not found!`);
    }

    // Step 2: update the quantity of the product stock
    const newStock = existingProduct.stock + stock;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    // Step 3: update the stock quantity of the product
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
      include: {
        category: true,
      },
    });

    // Step 4: return the updated product
    return this.formatProduct(updatedProduct);
  }

  // 6th API endpoint: delete a product by its single id
  async deleteProduct(id: string): Promise<{ message: string }> {
    // Step 1: check if the product exists by the specified id
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
        cartItems: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found!`);
    }

    // Step 2: check the total number of products in active order
    if (existingProduct.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot delete product that is part of existing orders',
      );
    }

    // Step 3: delete the product
    await this.prisma.product.delete({
      where: { id },
    });

    // Step 4: return the success message
    return { message: 'Product deleted successfully!' };
  }

  private formatProduct(
    product: Product & { category: Category },
  ): ProductResponseDto {
    return {
      ...product, // spread all properties of the product
      price: Number(product.price), // convert price from Decimal to Number
      category: product.category.name, // return category name instead of the whole category object
    };
  }
}
