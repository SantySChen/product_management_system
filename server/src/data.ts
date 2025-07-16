import bcrypt from "bcryptjs";
import { User } from "./models/userModel";

export const sampleUsers: User[] = [
    {
        email: 'manager@example.com',
        password: bcrypt.hashSync('123456'),
        isManager: true,
    },
    {
        email: 'regular@example.com',
        password: bcrypt.hashSync('123456'),
        isManager: false,
    }
]