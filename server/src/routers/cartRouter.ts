import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { isAuth } from '../utils';
import { CartModel } from '../models/cartModel';
import { ProductModel } from '../models/productModel';

export const cartRouter = express.Router();

// get cart
cartRouter.get(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const cart = await CartModel.findOne({ user: req.user!._id });
    res.json(
      cart || { cartItems: [], subTotal: 0, tax: 0, discount: 0, totalPrice: 0 }
    );
  })
);

// add product by 1
cartRouter.post(
  '/add',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.body;
    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    let cart = await CartModel.findOne({ user: req.user!._id });
    if (!cart) {
      cart = new CartModel({
        user: req.user!._id,
        cartItems: [],
        subTotal: 0,
        tax: 0,
        discount: 0,
        totalPrice: 0,
      });
    }

    const item = cart.cartItems.find(
      (x) => x._id === productId
    );

    if (item) {
      if (item.quantity >= product.countInStock) {
        res.status(400).json({ message: 'Cannot add more, out of stock' });
        return;
      }
      item.quantity += 1;
    } else {
      cart.cartItems.push({
        _id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        countInStock: product.countInStock,
        quantity: 1,
      });
    }

    updateCartTotals(cart);
    await cart.save();
    res.status(200).json(cart);
  })
);

// decrease product by 1
cartRouter.post(
  '/decrease',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.body;
    const cart = await CartModel.findOne({ user: req.user!._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const item = cart.cartItems.find(
      (x) => x._id === productId
    );
    if (!item) {
      res.status(404).json({ message: 'Product not in cart' });
      return;
    }

    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.cartItems = cart.cartItems.filter(
        (x) => x._id !== productId
      );
    }

    updateCartTotals(cart);
    await cart.save();
    res.status(200).json(cart);
  })
);

// remove product
cartRouter.post(
  '/remove',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.body;
    const cart = await CartModel.findOne({ user: req.user!._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.cartItems = cart.cartItems.filter(
      (x) => x._id !== productId
    );

    updateCartTotals(cart);
    await cart.save();
    res.status(200).json(cart);
  })
);

// count price
function updateCartTotals(cart: any) {
  const subTotal = cart.cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const tax = subTotal * 0.1;
  const discount = 0;
  const totalPrice = subTotal + tax - discount;

  cart.subTotal = subTotal;
  cart.tax = tax;
  cart.discount = discount;
  cart.totalPrice = totalPrice;
}

