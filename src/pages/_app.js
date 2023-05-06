import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Navbar from '../components/Navbar'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <>
      <SessionProvider>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp