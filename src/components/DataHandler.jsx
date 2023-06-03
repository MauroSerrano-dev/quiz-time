import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import LoadingPage from "./LoadingPage"

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading && session !== undefined) {
            setTimeout(() => setLoading(false), 500)
        }
    }, [session])

    return loading
        ? <LoadingPage progress={session === undefined ? 50 : 100} />
        : <div id={styles.website}>
            <Navbar session={session} signIn={signIn} signOut={signOut} />
            <div id={styles.componentContainer} >
                <Component{...pageProps} session={session} signIn={signIn} />
            </div>
        </div>
}