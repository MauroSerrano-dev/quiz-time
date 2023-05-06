import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import NavBar from '../components/NavBar'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <>
      <SessionProvider>
        <NavBar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp