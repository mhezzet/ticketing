import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsClient } from '../../nats-client'

it('return 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'new ticket',
      price: 123,
    })
    .expect(404)
})

it('return 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'new ticket',
      price: 123,
    })
    .expect(401)
})

it('return 401 if the user is does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdd',
      price: 12,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'asdd', price: 13 })
    .expect(401)
})

it('return 400 if the user provide invalid title or price', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdd',
      price: 12,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 123, price: 13 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 123, price: 'asd' })
    .expect(400)
})

it('return 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdd',
      price: 12,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdd', price: 13 })
    .expect(200)
})

it('publishes an event', async () => {
  const cookie = global.signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdd',
      price: 12,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'asdd', price: 13 })
    .expect(200)

  expect(natsClient.client.publish).toHaveBeenCalled()
})
