import jwt from 'jsonwebtoken'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

jest.mock('../nats-client.ts')

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  const payload = {
    id,
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)

  const session = JSON.stringify({ jwt: token })

  const base64 = Buffer.from(session).toString('base64')

  return [`express:sess=${base64}`]
}
