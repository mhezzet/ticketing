import { errorHandler, NotFoundError } from '@gittexing/common'
import cookieSession from 'cookie-session'
import express from 'express'
import 'express-async-errors'
import {
  createTicketRouter,
  showTicketRouter,
  showTicketsRouter,
  updateTicketRouter,
} from './routes'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(showTicketsRouter)
app.use(updateTicketRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
