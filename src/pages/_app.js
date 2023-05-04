import Head from 'next/head'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import NavBar from '../components/Navbar'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <title>NextJS TailwindCSS TypeScript Starter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SessionProvider>
        <NavBar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp