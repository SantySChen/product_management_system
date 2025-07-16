"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.sampleUsers = [
    {
        email: 'manager@example.com',
        password: bcryptjs_1.default.hashSync('123456'),
        isManager: true,
    },
    {
        email: 'regular@example.com',
        password: bcryptjs_1.default.hashSync('123456'),
        isManager: false,
    }
];
