"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("./types/Request");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const productRouter_1 = require("./routers/productRouter");
const seedRouter_1 = require("./routers/seedRouter");
const userRouter_1 = require("./routers/userRouter");
const cartRouter_1 = require("./routers/cartRouter");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/productmanagementsystemdb';
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('connected to mongodb');
})
    .catch((err) => {
    console.error('error connecting to mongodb:', err.message);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['http://localhost:5173'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/products', productRouter_1.productRouter);
app.use('/api/users', userRouter_1.userRouter);
app.use('/api/seed', seedRouter_1.seedRouter);
app.use('/api/cart', cartRouter_1.cartRouter);
// Static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
app.get('*', (req, res) => res.sendFile(path_1.default.join(__dirname, '../../client/dist/index.html')));
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
});
