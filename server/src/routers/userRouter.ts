import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { User, UserModel } from '../models/userModel'
import { generateToken } from '../utils'
import nodemailer from 'nodemailer'

export const userRouter = express.Router()

// POST /api/signin
userRouter.post(
    '/signin', 
    asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.json({
                _id: user._id,
                email: user.email,
                isManager: user.isManager,
                token: generateToken(user),
            })
        }
        return 
    }
    res.status(401).json({ message: 'Invalid email or password' })
})
)

// POST /api/signup
userRouter.post(
    '/signup',
    asyncHandler(async (req: Request, res: Response) => {
        const user = await UserModel.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        } as User)
        res.json({
            _id: user._id,
            email: user.email,
            isManager: user.isManager,
            token: generateToken(user),
        }) 
    })
)

userRouter.post(
  '/update',
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Reset Password',
      text: 'Reset the password', 
    });

    res.json({ message: 'Recovery email sent' });
  })
);