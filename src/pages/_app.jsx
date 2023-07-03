import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import DataHandler from '@/components/DataHandler'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MontserratRegular from '../../public/fonts/montserrat.ttf';
import { useEffect, useState } from 'react';
import Script from 'next/script';

const mainTheme = createTheme({
  palette: {
    primary: {
      main: '#009fda',
    },
    secondary: {
      main: '#e5e5e5'
    },
    neutral: {
      main: '#ffffff',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: [MontserratRegular, 'Arial', 'sans-serif',
    ].join(','),
  },
});

function MyApp(props) {
  const { Component, pageProps } = props

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Inicialize os valores iniciais ao carregar a página
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div>
      <Head>
        <title>Quiz Time</title>
        <meta name="description" content="Quiz Time: Create captivating quizzes and deliver interactive presentations. Engage your audience with dynamic content and foster active participation. Perfect for educators, trainers, and presenters. Start creating interactive quizzes now!" />
        <meta name="keywords" content="Quiz, Presentation, Create, Audience, Interact, Game, Jogo, Apresentação, Criar" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="referrer" content="no-referrer" />

        {/* Meta tags Open Graph */}
        <meta property="og:title" content="Quiz Time" />
        <meta property="og:description" content="Create captivating quizzes and deliver interactive presentations. Engage your audience with dynamic content and foster active participation. Perfect for educators, trainers, and presenters. Start creating interactive quizzes now!" />
        <meta property="og:image" content="https://quiztimeapp.com/logos/QT-logo-black-blue.jpg" />
        <meta property="og:url" content="https://quiztimeapp.com" />

        <link rel="icon" href="logos/QT-logo.png" />
        <Script src="https://js.stripe.com/v3/" async></Script>
      </Head>
      <ThemeProvider theme={mainTheme}>
        <SessionProvider>
          <DataHandler pageProps={pageProps} Component={Component} />
          <ToastContainer newestOnTop transition={Flip} style={{ color: 'white' }} className="foo" />
          {/* <div style={{ border: 'red dashed 2px', width: `${windowWidth}px`, height: `${windowHeight}px`, position: 'fixed', zIndex: '99999999999' }}>
          </div> */}
        </SessionProvider>
      </ThemeProvider>
    </div>
  )
}

export default MyApp