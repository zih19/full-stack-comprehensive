import { Product } from "./product.types";
export interface CartState {
  items: CartItem[]; // The cart may contain multiple products
  totalItems: number; // the total number representing how many items in the cart
  totalPrice: number; // the total price of all the items in the cart
}

export interface CartItem {
  id: string; // the unique identifier of the cart item, which is a string
  cartId: string; // the unique identifier for the cart id connecting the product id
  productId: string; // the unique identifier of the product id
  quantity: number; // the quantity of the product in the cart, which is a number
  price: number; // the price of the product in the cart, which is a number
  product: Product; // the specific details of the product
  createdAt: string; // When was the cart item created?
  updatedAt: string; // When was the cart item last updated?
}