import { IRootState } from '@/store';
import { CartItem } from '@/types/cart.types';
import { useSelector } from 'react-redux';

export function useCart() {

  const reduxCart = useSelector((state: IRootState) => state.cart); // get the cart state from the redux store
  
  const cartItems: CartItem[] = reduxCart.items; // the items in the cart
  
  return {
    items: cartItems,
    totalItems: cartItems.reduce((total, item) => total + item.quantity, 0), // calculate the total number of items in the cart
    totalPrice: reduxCart.totalPrice, // the total price of the items in the cart
  };

}

