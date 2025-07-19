import jwt from 'jsonwebtoken'
import { User } from "./models/userModel";
import { NextFunction, Request, Response } from 'express';
import nodemailer from 'nodemailer'

export const generateToken = (user: User) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            isManager: user.isManager,
        },
        process.env.JWT_SECRET || 'somethingsecret',
        {
            expiresIn: '7d',
        }
    )
}

interface JwtPayload {
  _id: string;
  email: string;
  isManager: boolean;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7);
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret'
      ) as JwtPayload;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
  } else {
    return res.status(401).json({ message: 'No Token Provided' });
  }
};


export const sendRecoveryEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"YourApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Recovery Link',
    html: `
      <p>Click the link below to reset your password:</p>
      <a href="${link}">${link}</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};