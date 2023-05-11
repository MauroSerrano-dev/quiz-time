import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import DataHandler from '@/components/DataHandler'

function MyApp(props) {
  const { Component, pageProps } = props

  return (
    <SessionProvider>
      <DataHandler pageProps={pageProps} Component={Component} />
    </SessionProvider>

  )
}

export default MyApp