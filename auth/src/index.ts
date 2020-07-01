import mongoose from 'mongoose'
import { app } from './app'

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be defined')
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI must be defined')
}

console.log('starting...')

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('🧇connected to db!')
    app.listen(3000, () => console.log('🧇listening on port 3000!'))
  })
  .catch((error) => console.error(error))
