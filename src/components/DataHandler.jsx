import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { Button } from '@mui/material';
import { useState } from "react";
import NoSessionPage from "./NoSessionPage";

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()

    return (
        <div>
            <Navbar session={session} signIn={signIn} signOut={signOut} />
            <div id={styles.componentContainer} >
                <Component{...pageProps} session={session} signIn={signIn} />
            </div>
        </div>
    )
}