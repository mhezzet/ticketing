import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models'
import { natsClient } from '../../nats-client'

it('there is a route listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets')

  expect(response.status).not.toEqual(404)
})

it('can only accesses if the user is signed in', async () => {
  await request(app).post('/api/tickets').expect(401)
})

it('access to auth users', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())

  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 12,
      price: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 123,
    })
    .expect(400)
})

it('returns an error if an in valid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 12,
      price: 'asd',
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})

  expect(tickets.length).toEqual(0)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 123,
    })
    .expect(201)

  tickets = await Ticket.find({})

  expect(tickets.length).toEqual(1)
})

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 123,
    })
    .expect(201)

  expect(natsClient.client.publish).toHaveBeenCalled()
})
