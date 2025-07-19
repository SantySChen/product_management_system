import { type ReactNode, createContext, useReducer, type Dispatch } from 'react';
import { queryClient } from './main';
import type { UserInfo } from './types/UserInfo';
import type { Cart } from './types/Cart';

type AppState = {
  userInfo?: UserInfo | null;
  cart: Cart;
};

const getInitialUserInfo = (): UserInfo | null => {
  try {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getInitialCart = (): Cart => {
  try {
    const storedCartItems = localStorage.getItem('cart');
    const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
    // Initialize other values to zero; you could also store entire cart if you want
    return {
      cartItems,
      subTotal: 0,
      tax: 0,
      discount: 0,
      totalPrice: 0,
    };
  } catch {
    return {
      cartItems: [],
      subTotal: 0,
      tax: 0,
      discount: 0,
      totalPrice: 0,
    };
  }
};

const initialState: AppState = {
  userInfo: getInitialUserInfo(),
  cart: getInitialCart()
};

type Action =
  | { type: 'USER_SIGNIN'; payload: UserInfo }
  | { type: 'USER_SIGNOUT' }
  | { type: 'CART_UPDATE'; payload: Cart };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'USER_SIGNIN':
      try {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['cartItemQuatity'] });
      } catch (error) {
        console.log("localstorage error:", error)
      }
      return { ...state, userInfo: action.payload };

    case 'USER_SIGNOUT':
      try {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems');
        queryClient.removeQueries({ queryKey: ['cart'] })
      } catch (error) {
        console.log("localstorage error:", error)
      }
      return {
        userInfo: null,
        cart: {
          cartItems: [],
          subTotal: 0,
          tax: 0,
          discount: 0,
          totalPrice: 0,
        },
      };

    case 'CART_UPDATE': {
      const newCart = action.payload;
      try {
        localStorage.setItem('cartItems', JSON.stringify(newCart.cartItems || []));
        // Optionally, store full cart JSON if needed:
        // localStorage.setItem('cart', JSON.stringify(newCart));
      } catch (error) {
        console.log("localstorage error:", error)
      }
      return {
        ...state,
        cart: newCart,
      };
    }

    default:
      return state;
  }
}

// Create context with strict typing for state and dispatch
interface StoreContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const defaultDispatch: Dispatch<Action> = () => {
  // no-op
};

const Store = createContext<StoreContextType>({
  state: initialState,
  dispatch: defaultDispatch,
});

interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({ children }: StoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
}

export { Store, StoreProvider };
