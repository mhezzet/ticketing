import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/buildClient'
import Header from '../components/header'

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  )
}

MyApp.getInitialProps = async (context) => {
  const client = await buildClient(context.ctx).get('/api/users/currentuser')

  let pageProps = {}

  if (context.Component.getInitialProps)
    pageProps = await context.Component.getInitialProps(
      context.ctx,
      client,
      client.data.currentUser
    )

  return { ...client.data, pageProps }
}

export default MyApp
