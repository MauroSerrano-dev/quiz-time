import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import DataHandler from '@/components/DataHandler'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <div>
      <Head>
        <title>Quiz Time</title>
        <meta name="description" content="Quiz Buider App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/quiz-time-logo.png" />
      </Head>
      <SessionProvider>
        <DataHandler pageProps={pageProps} Component={Component} />
        <ToastContainer newestOnTop transition={Flip} />
      </SessionProvider>
    </div>
  )
}

export default MyApp