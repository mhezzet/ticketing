import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { NotFoundError } from './errors'
import { errorHandler } from './middlewares'
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from './routes'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be defined')
}

mongoose
  .connect('mongodb://auth-mongo-srv:27017/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('🧇connected to db!')
    app.listen(3000, () => console.log('🧇listening on port 3000!'))
  })
  .catch((error) => console.error(error))
