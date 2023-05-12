import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import DataHandler from '@/components/DataHandler'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <SessionProvider>
      <DataHandler pageProps={pageProps} Component={Component} />
      <ToastContainer newestOnTop transition={Flip} />
    </SessionProvider>
  )
}

export default MyApp