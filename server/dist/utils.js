"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        _id: user._id,
        email: user.email,
        isManager: user.isManager,
    }, process.env.JWT_SECRET || 'somethingsecret', {
        expiresIn: '7d',
    });
};
exports.generateToken = generateToken;
const isAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.slice(7);
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'somethingsecret');
            req.user = decoded;
            next();
        }
        catch (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }
    }
    else {
        return res.status(401).json({ message: 'No Token Provided' });
    }
};
exports.isAuth = isAuth;
