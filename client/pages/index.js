import React from 'react'
import axios from 'axios'
import buildClient from '../api/buildClient'

function Landing({ currentUser }) {
  console.log('current user', currentUser)
  return (
    <div>
      {currentUser ? (
        <h1>you are signed in</h1>
      ) : (
        <h1>you are not signed in</h1>
      )}
    </div>
  )
}

Landing.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/currentuser')

  return data
}

export default Landing
