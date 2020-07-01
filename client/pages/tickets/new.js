import { useState } from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default function New({ currentUser }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [createTicket, errors] = useRequest({
    url: '/api/tickets',
    body: { title, price },
    methode: 'post',
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = (event) => {
    event.preventDefault()
    createTicket()
  }

  return (
    <div className="container">
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            type="text"
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
