import React from 'react'
import axios from 'axios'
import buildClient from '../api/buildClient'
import Link from 'next/link'

function Landing({ currentUser, tickets }) {
  console.log('tickets', tickets)

  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>view</a>
        </Link>
      </td>
    </tr>
  ))

  return (
    <div className="container">
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

Landing.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/tickets')

  return { tickets: data }
}

export default Landing
