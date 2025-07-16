export type CartItem = {
    _id: string
    image: string | undefined
    name: string
    quantity: number
    countInStock: number
    price: number
}

export type Cart = {
    cartItems: CartItem[]
    subTotal: number
    tax: number
    discount: number
    totalPrice: number
}

