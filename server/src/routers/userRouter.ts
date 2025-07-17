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
  '/check-email',
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  })
);