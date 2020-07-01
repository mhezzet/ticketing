import buildClient from '../../api/buildClient'

function Orders({ orders }) {
  return (
    <ul className="container">
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  )
}

Orders.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get(`/api/orders`)

  return { orders: data }
}

export default Orders
