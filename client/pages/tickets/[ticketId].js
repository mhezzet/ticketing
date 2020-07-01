import useRequest from '../../hooks/useRequest'
import Router from 'next/router'
import buildClient from '../../api/buildClient'

function TicketShow({ ticket }) {
  const [purchase, errors] = useRequest({
    url: '/api/orders',
    methode: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  })

  console.log('ticket', ticket)

  return (
    <div className="container">
      <h1>{ticket.title}</h1>
      <h4>price: {ticket.price}</h4>
      {errors}
      <button onClick={() => purchase()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  )
}

TicketShow.getInitialProps = async (context) => {
  const { ticketId } = context.query

  const { data } = await buildClient(context).get(`/api/tickets/${ticketId}`)

  return { ticket: data }
}

export default TicketShow
