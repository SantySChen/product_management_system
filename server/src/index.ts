import cors from 'cors'
import './types/Request'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { cartRouter } from './routers/cartRouter'
import { Express } from 'express-serve-static-core'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/productmanagementsystemdb'

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch((err) => {
    console.error('error connecting to mongodb:', err.message)
  })

const app = express()

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/seed', seedRouter)
app.use('/api/cart', cartRouter)

// Static files
app.get('/', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
);

app.get('/products', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
);

const PORT = 8080
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
function expressListEndpoints(app: Express): any {
  throw new Error('Function not implemented.')
}

