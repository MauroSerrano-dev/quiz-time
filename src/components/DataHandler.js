import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from '../components/Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect } from "react"

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()

    useEffect(() => {
        console.log(session)
    }, [session])

    return (
        <div>
            {session === null &&
                <div className={styles.noSessionContainer}>
                    <img className={styles.logo} src='/quiz-time-logo.png' />
                    <button onClick={() => signIn()}>Sign in</button>
                </div>
            }
            {
                session &&
                <div>
                    <Navbar session={session} signIn={signIn} signOut={signOut} />
                    <Component {...pageProps} session={session} />
                </div>
            }
        </div>
    )
}