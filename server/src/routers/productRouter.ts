import express from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'

export const productRouter = express.Router()

// get all product
productRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const products = await ProductModel.find()
        res.json(products)
    })
)

// get all products by added time
productRouter.get(
    '/sort/latest',
    asyncHandler(async (req, res) => {
        const products = await ProductModel.find().sort({ createdAt: -1 })
        res.json(products)
    })
)

// get all products by price low to high
productRouter.get(
    '/sort/price-asc',
    asyncHandler(async (req, res) => {
        const products = await ProductModel.find().sort({ price: 1 })
        res.json(products)
    })
)

// get all products by price high to low 
productRouter.get(
    '/sort/price-desc',
    asyncHandler(async (req, res) => {
        const products = await ProductModel.find().sort({ price: -1 })
        res.json(products)
    })
)

// get product by id
productRouter.get(
    '/product/:id',
    asyncHandler(async (req, res) => {
        const product = await ProductModel.findById(req.params.id)
        if(product) {
            res.json(product)
        } else {
            res.status(404).json({ message: 'Product Not Found'})
        }
    })
)

// search product by name 
productRouter.get(
    '/search',
    asyncHandler(async (req, res) => {
        const searchQuery = req.query.q as string;
        const products = await ProductModel.find({
            name: { $regex: searchQuery, $options: 'i' },
        })
        res.json(products)
    })
)

// add a new product
productRouter.post(
    '/',
    asyncHandler(async (req, res) => {
        const {
            name,
            description,
            category,
            price,
            countInStock,
            image,
        } = req.body;

        if (!name || !description || !category || !price || !image) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const newProduct = new ProductModel({
            name,
            description,
            category,
            price,
            countInStock,
            image,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    })
)

