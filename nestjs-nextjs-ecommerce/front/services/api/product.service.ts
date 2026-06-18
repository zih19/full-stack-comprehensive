import { ProductQueryParams, ProductResponse, Product } from "@/types/product.types";
import { apiClient } from "./axios.config";
export class ProductService {
  
  // define a class constant level endpoint that cannot be changed
  private static readonly ENDPOINT = "/products";

  // define a method called getProducts to get all products
  static async getProducts(params?: ProductQueryParams): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(this.ENDPOINT, {
        params,
    }); // pass the optional query params in the request

    // return the data back to the client
    return response.data; 
  }

  // define a method called getProductById to get a specified product based on the product ID
  static async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.ENDPOINT}/${id}`); // make a GET request to the endpoint with the product ID

    // return the product data back to the client
    return response.data; 
  }
}