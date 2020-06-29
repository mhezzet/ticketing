import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'

it('returns 404 if the ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app).get(`/api/tickets/${id}`).expect(404)
})

it('return the ticket if the ticket is found', async () => {
  const title = 'new ticket'
  const price = 20

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201)

  await request(app).get(`/api/tickets/${response.body.id}`).expect(200)
})
