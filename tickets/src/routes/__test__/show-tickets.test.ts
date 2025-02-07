import request from 'supertest'
import { app } from '../../app'

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'new ticket',
      price: 20,
    })
    .expect(201)
}

it('return tickets', async () => {
  await createTicket()
  await createTicket()

  const response = await request(app).get('/api/tickets').expect(200)

  expect(response.body.length).toEqual(2)
})
