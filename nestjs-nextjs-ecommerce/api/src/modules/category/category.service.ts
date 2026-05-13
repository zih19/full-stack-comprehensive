import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Category } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Part 1: create a new category based on the createCategoruDto
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // extract all those values from the createCategoryDto and generate a slug for the category based on the name if the slug is not provided
    const { name, slug, ...rest } = createCategoryDto;

    const categorySlug =
      slug ??
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, ''); // generate slug from name if slug is not provided

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (existingCategory) {
      throw new Error('The category with the same slug already exists!');
    }

    // We have to create a new category if eligible
    const newCategory = await this.prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        ...rest,
      },
    });

    return this.formatCategory(newCategory, 0);
  }

  // Part 2: find all categories with optional filters and pagination
  async findAll(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    // Step 1: extract those query parameters from the queryDto
    const { isActive, search, page = 1, limit = 10 } = queryDto;

    // Step 2: build the where condition for the query based on the filters
    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          description: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true }, // count the number of products in each category
        },
      },
    });

    // Finally, we have to return the output
    return {
      data: categories.map((category) =>
        this.formatCategory(category, category._count.products),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Part 3: find a specific category by id with the product details
  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }, // count the number of products in this category
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category Not Found!');
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  // Part 4: find a specific category by slug with the product details
  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true }, // count the number of products in this category
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category Not Found!');
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  private formatCategory(
    categoryData: Category,
    productCount: number,
  ): CategoryResponseDto {
    return {
      id: categoryData.id,
      name: categoryData.name,
      description: categoryData.description,
      slug: categoryData.slug ?? null,
      imageUrl: categoryData.imageUrl,
      isActive: categoryData.isActive,
      productCount,
      createdAt: categoryData.createdAt,
      updatedAt: categoryData.updatedAt,
    };
  }
}
