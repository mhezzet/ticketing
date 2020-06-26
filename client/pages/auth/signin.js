import React, { useState } from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default function signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signup, errors] = useRequest({
    body: { email, password },
    methode: 'post',
    url: '/api/users/signin',
    onSuccess: () => Router.push('/'),
  })

  const onSubmit = async (event) => {
    event.preventDefault()
    await signup()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign in</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          type="email"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          type="password"
        />
      </div>
      {errors}
      <button className="btn btn-primary" type="submit">
        Sign In
      </button>
    </form>
  )
}
