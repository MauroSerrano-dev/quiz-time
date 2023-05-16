import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import DataHandler from '@/components/DataHandler'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MontserratRegular from '../../public/fonts/montserrat.ttf';

const mainTheme = createTheme({
  palette: {
    primary: {
      main: '#009fda',
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    fontFamily: [MontserratRegular, 'Arial', 'sans-serif',
    ].join(','),
  },
});

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
      <ThemeProvider theme={mainTheme}>
        <SessionProvider>
          <DataHandler pageProps={pageProps} Component={Component} />
          <ToastContainer newestOnTop transition={Flip} style={{color: 'white'}} className="foo" />
        </SessionProvider>
      </ThemeProvider>
    </div>
  )
}

export default MyApp