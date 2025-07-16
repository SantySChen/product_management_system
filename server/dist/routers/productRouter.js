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
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const productModel_1 = require("../models/productModel");
exports.productRouter = express_1.default.Router();
// get all product
exports.productRouter.get('/', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.ProductModel.find();
    res.json(products);
})));
// get all products by added time
exports.productRouter.get('/sort/latest', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.ProductModel.find().sort({ createdAt: -1 });
    res.json(products);
})));
// get all products by price low to high
exports.productRouter.get('/sort/price-asc', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.ProductModel.find().sort({ price: 1 });
    res.json(products);
})));
// get all products by price high to low 
exports.productRouter.get('/sort/price-desc', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.ProductModel.find().sort({ price: -1 });
    res.json(products);
})));
// get product by id
exports.productRouter.get('/product/:id', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.ProductModel.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json({ message: 'Product Not Found' });
    }
})));
// search product by name 
exports.productRouter.get('/search', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = req.query.q;
    const products = yield productModel_1.ProductModel.find({
        name: { $regex: searchQuery, $options: 'i' },
    });
    res.json(products);
})));
// add a new product
exports.productRouter.post('/', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category, price, countInStock, image, } = req.body;
    if (!name || !description || !category || !price || !image) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }
    const newProduct = new productModel_1.ProductModel({
        name,
        description,
        category,
        price,
        countInStock,
        image,
    });
    const savedProduct = yield newProduct.save();
    res.status(201).json(savedProduct);
})));
