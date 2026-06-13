import { ProductQueryParams, ProductResponse } from "@/types/product.types";
import { apiClient } from "./axios.config";
export class ProductService {
  
  // define a class constant level endpoint that cannot be changed
  private static readonly ENDPOINT = "/products";

  // define a method called getProducts
  static async getProducts(params?: ProductQueryParams): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(this.ENDPOINT, {
        params,
    }); // pass the optional query params in the request

    // return the data back to the client
    return response.data; 
  }
}