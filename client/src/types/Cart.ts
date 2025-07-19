export type CartItem = {
    product: string
    image?: string | null
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

