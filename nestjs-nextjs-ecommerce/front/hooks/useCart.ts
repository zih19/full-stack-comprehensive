import { IRootState } from '@/store';
import { CartItem } from '@/types/cart.types';
import { useSelector, useDispatch } from 'react-redux';
import { Product } from '@/types/product.types';
import { addToCart as addToCartAction } from '@/app/slices/cartSlice';

export function useCart() {

  const reduxCart = useSelector((state: IRootState) => state.cart); // get the cart state from the redux store
  
  const cartItems: CartItem[] = reduxCart.items; // the items in the cart

  const dispatch = useDispatch(); // gives the component access to the redux store

  const addProductToCart = async(product: Product) => {
    dispatch(addToCartAction(product)); // create the action in cartSlice.ts file under slices folder
  }
  
  return {
    items: cartItems,
    totalItems: cartItems.reduce((total, item) => total + item.quantity, 0), // calculate the total number of items in the cart
    totalPrice: reduxCart.totalPrice, // the total price of the items in the cart
    addProductToCart,
  };

}

