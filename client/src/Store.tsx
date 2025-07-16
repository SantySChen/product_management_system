import React from 'react';
import type { UserInfo } from './types/UserInfo';
import type { Cart, CartItem } from './types/Cart';

type AppState = {
  userInfo?: UserInfo | null;
  cart: Cart;
};

const initialState: AppState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,

  cart: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems')!)
      : [],
    subTotal: 0,
    tax: 0,
    discount: 0,
    totalPrice: 0,
  },
};

type Action =
  | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: 'USER_SIGNOUT' }
  | { type: 'CART_ADD_ITEM'; payload: CartItem }
  | { type: 'CART_REMOVE_ITEM'; payload: CartItem }
  | { type: 'CART_CLEAR' }
  | { type: 'CART_UPDATE'; payload: Cart };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };

    case 'USER_SIGNOUT':
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
      return {
        userInfo: undefined,
        cart: { cartItems: [], subTotal: 0, tax: 0, discount: 0, totalPrice: 0 },
      };

    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'CART_CLEAR':
      localStorage.removeItem('cartItems');
      return {
        ...state,
        cart: {
          cartItems: [],
          subTotal: 0,
          tax: 0,
          discount: 0,
          totalPrice: 0,
        },
      };

    case 'CART_UPDATE':
      localStorage.setItem('cartItems', JSON.stringify(action.payload.cartItems));
      return {
        ...state,
        cart: {
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});

function StoreProvider(props: React.PropsWithChildren<unknown>) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return <Store.Provider value={{ state, dispatch }} {...props} />;
}

export { Store, StoreProvider };
