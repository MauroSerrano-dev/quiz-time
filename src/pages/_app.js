import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import DataHandler from '@/components/DataHandler'
import { ToastContainer } from 'react-toastify'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <SessionProvider>
      <DataHandler pageProps={pageProps} Component={Component} />
      <ToastContainer />
    </SessionProvider>
  )
}

export default MyApp