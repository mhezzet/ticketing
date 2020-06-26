import { useEffect } from 'react'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

export default function signout() {
  const [signOut] = useRequest({
    methode: 'post',
    onSuccess: () => Router.push('/'),
    url: '/api/users/signout',
    body: {},
  })

  useEffect(() => {
    signOut()
  }, [])

  return <div>Signing you out...</div>
}
