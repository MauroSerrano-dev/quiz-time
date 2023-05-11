import styles from '../styles/index.module.css'
import Head from 'next/head'

export default function Index(props) {
  const { session } = props

  return (
    <div>
      <Head>
        <title>Quiz Time</title>
        <meta name="description" content="Quiz Buider App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      </main>
    </div>
  );
}