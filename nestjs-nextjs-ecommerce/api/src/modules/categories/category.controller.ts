import {
  Controller,
  Post,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 1st API route: create a new category
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // JwtAuthGuard: verify if the user has already been authenticated
  //                                  // RolesGuard: verify if the user has the required role to access this route
  @Roles(Role.ADMIN) // define the role the user should have -> This API endpoint is accessible to admin only
  @ApiBearerAuth('jwt-auth') // the name of the security scheme should be jwt-auth
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiBody({
    type: CreateCategoryDto, // the shape of the request body
  })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created!',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  // 2nd API route: get all categories
  //  -> the general info for all categories without the product details
  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve a list of all categories',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all categories has been retrieved successfully!',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CategoryResponseDto' }, // reference the CategoryResponseDto schema for the items in the array
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(@Query() queryDto: QueryCategoryDto) {
    return await this.categoryService.findAll(queryDto);
  }

  // 3rd API route: get a specific category by id with the product details
  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The details for this category has been retrieved successfully!',
    type: CategoryResponseDto, // the shape of the response data
  })
  @ApiResponse({
    status: 404,
    description: 'Category Not Found',
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return await this.categoryService.findOne(id);
  }

  // 4th API route: get a specific category by slur with the product details
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get category by slug',
  })
  @ApiResponse({
    status: 200,
    description:
      'The details for this category has been retrieved successfully!',
    type: CategoryResponseDto, // the shape of the response data
  })
  @ApiResponse({
    status: 404,
    description: 'Category Not Found',
  })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return await this.categoryService.findBySlug(slug);
  }

  // 5th API route: update the category (Admin only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Update Category (Admin only)',
  })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category slug already',
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  // 6th API route: delete the category (Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('jwt-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Category (Admin only)',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete category with products',
  })
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    return await this.categoryService.deleteCategory(id);
  }
}
