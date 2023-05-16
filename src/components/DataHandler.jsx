import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect } from "react"
import { Button } from '@mui/material';

const FREE_PAGES = [
    'Support'
]

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()

    useEffect(() => {
        console.log(session)
    }, [session])

    useEffect(() => {
        console.log(Component.name)
    }, [Component])

    return (
        <div>
            {session === null && !FREE_PAGES.includes(Component.name) &&
                <div className={styles.noSessionContainer}>
                    <img className={styles.logo} src='/quiz-time-logo.png' />
                    <Button variant="outlined" onClick={() => signIn()}>Sign in</Button>
                </div>
            }
            {
                (session || FREE_PAGES.includes(Component.name)) &&
                <div>
                    <Navbar session={session} signIn={signIn} signOut={signOut} />
                    <Component {...pageProps} session={session} />
                </div>
            }
        </div>
    )
}