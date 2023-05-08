import styles from '../styles/index.module.css'
import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head'

export default function Index() {
  const { data: session } = useSession()

  return (
    <div>
      <Head>
        <title>Quiz Time</title>
        <meta name="description" content="Quiz Buider App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {false && session && <div className={styles.box} onClick={handleClick} style={{ backgroundColor: room.active ? 'red' : 'blue' }}></div>}
      </main>
    </div>
  );
}