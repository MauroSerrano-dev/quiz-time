import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect } from "react"
import { Button } from '@mui/material';

const FREE_PAGES = [
    'Support',
    'Index'
]

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()

    return (
        <div>
            {session === null &&
                <div id={styles.noSessionContainer}>
                    <img id={styles.logo} src='/quiz-time-logo.png' />
                    <Button variant="outlined" onClick={() => signIn()}>Sign in</Button>
                </div>
            }
            {
                session &&
                <div>
                    <Navbar session={session} signIn={signIn} signOut={signOut} />
                    <div id={styles.componentContainer} >
                        <Component{...pageProps} session={session} />
                    </div>
                </div>
            }
        </div>
    )
}