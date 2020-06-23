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
app.use(express.json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', () => {
  new NotFoundError()
})

app.use(errorHandler)

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
