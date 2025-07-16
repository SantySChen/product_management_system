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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("../models/userModel");
const utils_1 = require("../utils");
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.userRouter = express_1.default.Router();
// POST /api/signin
exports.userRouter.post('/signin', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.UserModel.findOne({ email: req.body.email });
    if (user) {
        if (bcryptjs_1.default.compareSync(req.body.password, user.password)) {
            res.json({
                _id: user._id,
                email: user.email,
                isManager: user.isManager,
                token: (0, utils_1.generateToken)(user),
            });
        }
        return;
    }
    res.status(401).json({ message: 'Invalid email or password' });
})));
// POST /api/signup
exports.userRouter.post('/signup', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.UserModel.create({
        email: req.body.email,
        password: bcryptjs_1.default.hashSync(req.body.password),
    });
    res.json({
        _id: user._id,
        email: user.email,
        isManager: user.isManager,
        token: (0, utils_1.generateToken)(user),
    });
})));
exports.userRouter.post('/update', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.UserModel.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    yield transporter.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Reset Password',
        text: 'Reset the password',
    });
    res.json({ message: 'Recovery email sent' });
})));
