import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { Button } from '@mui/material';
import { useState } from "react";

const FREE_PAGES = [
    'Support',
    'Index'
]

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()
    const [pageName, setPageName] = useState(Component.name)

    return (
        <div>
            {session === null && !FREE_PAGES.includes(pageName) &&
                <div id={styles.noSessionContainer}>
                    <img id={styles.logo} src='/quiz-time-logo.png' />
                    <Button variant="outlined" onClick={() => signIn()}>Sign in</Button>
                </div>
            }
            {
                (session || FREE_PAGES.includes(pageName)) &&
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