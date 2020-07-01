import useRequest from '../../hooks/useRequest'
import { Router } from 'next/router'
import buildClient from '../../api/buildClient'
import { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout'

function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState('')

  const [purchase, errors] = useRequest({
    url: '/api/payments',
    methode: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'),
  })

  useEffect(() => {
    const findTime = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTime()
    const timer = setInterval(() => {
      findTime()
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="container">
      <h1>purchasing: {order.ticket.title}</h1>
      <div>time left to pay: {timeLeft}</div>
      <StripeCheckout
        token={(token) => purchase({ token: token.id })}
        amount={order.ticket.price}
        email={currentUser.email}
        stripeKey="pk_test_51GzlepGeASeJHSImDzSO6o1ww7lT5lUs4CgMYADdxpcvrQJ5NOHfeNJIEJDZOscOD4dtmFez88QcKXaeCSH8gHMo00SGB050iP"
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context) => {
  const { orderId } = context.query

  const { data } = await buildClient(context).get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
