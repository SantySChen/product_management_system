"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const utils_1 = require("../utils");
const cartModel_1 = require("../models/cartModel");
const productModel_1 = require("../models/productModel");
exports.cartRouter = express_1.default.Router();
// get cart
exports.cartRouter.get('/', utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cartModel_1.CartModel.findOne({ user: req.user._id });
    res.json(cart || { cartItems: [], subTotal: 0, tax: 0, discount: 0, totalPrice: 0 });
})));
// add product by 1
exports.cartRouter.post('/add', utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const product = yield productModel_1.ProductModel.findById(productId);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    let cart = yield cartModel_1.CartModel.findOne({ user: req.user._id });
    if (!cart) {
        cart = new cartModel_1.CartModel({
            user: req.user._id,
            cartItems: [],
            subTotal: 0,
            tax: 0,
            discount: 0,
            totalPrice: 0,
        });
    }
    const item = cart.cartItems.find((x) => x._id === productId);
    if (item) {
        if (item.quantity >= product.countInStock) {
            res.status(400).json({ message: 'Cannot add more, out of stock' });
            return;
        }
        item.quantity += 1;
    }
    else {
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
    yield cart.save();
    res.status(200).json(cart);
})));
// decrease product by 1
exports.cartRouter.post('/decrease', utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const cart = yield cartModel_1.CartModel.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
    }
    const item = cart.cartItems.find((x) => x._id === productId);
    if (!item) {
        res.status(404).json({ message: 'Product not in cart' });
        return;
    }
    item.quantity -= 1;
    if (item.quantity <= 0) {
        cart.cartItems = cart.cartItems.filter((x) => x._id !== productId);
    }
    updateCartTotals(cart);
    yield cart.save();
    res.status(200).json(cart);
})));
// remove product
exports.cartRouter.post('/remove', utils_1.isAuth, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const cart = yield cartModel_1.CartModel.findOne({ user: req.user._id });
    if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
    }
    cart.cartItems = cart.cartItems.filter((x) => x._id !== productId);
    updateCartTotals(cart);
    yield cart.save();
    res.status(200).json(cart);
})));
// count price
function updateCartTotals(cart) {
    const subTotal = cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subTotal * 0.1;
    const discount = 0;
    const totalPrice = subTotal + tax - discount;
    cart.subTotal = subTotal;
    cart.tax = tax;
    cart.discount = discount;
    cart.totalPrice = totalPrice;
}
