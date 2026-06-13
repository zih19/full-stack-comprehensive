import { Product, ProductQueryParams, ProductResponse } from "@/types/product.types";
import { useState, useCallback } from "react";
import { ProductService } from "@/services/api/product.service";


export function useProducts() {

  const [isLoading, setIsLoading] = useState(false); // load all products
  const [error, setError] = useState<string | null>(null); // error message if any error occurs during fetching products
  const [products, setProducts] = useState<Product[]>([]); // the products list
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  // The function getProducts is actually an asynchronous function.
  const getProducts = useCallback(
    async (params?: ProductQueryParams): Promise<ProductResponse | null> => {
      setIsLoading(true); // starts loading
      setError(null); // clear the previous error

      try {
            // call the getProducts API to fetch products from the backend, which is an asynchronous operation
            // ProductService
            const response = await ProductService.getProducts(params); 

            setProducts(response.data); // update the products state with the data from the response -> response.data.data
            setMeta(response.meta); // update the product state with the meta info from the response -> response.data.meta
            return response; // return the full response object
      } catch (error) {
            
            // return an error message
            const message = "Failed to load products";
            setError(message); // update the error state with the error message
            return null; // indicate the operation fails
      } finally {
            setIsLoading(false); // ends loading
      }
    }, []
  );

  
  return { isLoading, products, getProducts, error, meta };
}