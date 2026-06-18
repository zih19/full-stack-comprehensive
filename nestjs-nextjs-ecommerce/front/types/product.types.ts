// import { Category } from '@/types/category.types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string; // stock keeping unit, which is a unique identifier for inventory calls and business tracking
  imageUrl: string; // the URL of the product image, which is a string
  category: string; // a category object -> Each product belongs to a category
  categoryId: string; // the unique identifier of the category, which is a string
}

export interface ProductQueryParams {
  page?: number; // specifies which page of the result needs to be fetched
  limit?: number; // specifies how many products per page
  search?: string; // a search term to filter products by name or description
  category?: string; // filter products by category
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  data: Product[]; // the list of products returned from the API
  meta: PaginationMeta; // follows PaginationMeta interface
}

