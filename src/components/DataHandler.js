import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from '../components/Navbar'

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()


    return (
        <div>
            <Navbar session={session} signIn={signIn} signOut={signOut} />
            <Component {...pageProps} session={session} />
        </div>
    )
}