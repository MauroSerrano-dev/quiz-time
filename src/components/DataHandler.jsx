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

    return (
        <div>
            {session === null && !FREE_PAGES.includes(Component.name) &&
                <div id={styles.noSessionContainer}>
                    <img id={styles.logo} src='/quiz-time-logo.png' />
                    <Button variant="outlined" onClick={() => signIn()}>Sign in</Button>
                </div>
            }
            {
                (session || FREE_PAGES.includes(Component.name)) &&
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