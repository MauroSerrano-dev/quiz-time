import { useSession, signIn, signOut } from "next-auth/react"
import Navbar from './Navbar'
import styles from '../styles/components/DataHandler.module.css'
import { useEffect, useState } from "react"
import LoadingPage from "./LoadingPage"

export default function DataHandler(props) {
    const { Component, pageProps } = props
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        if (loading && session !== undefined) {
            setTimeout(() => setLoading(false), 500)
        }
    }, [session])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Inicialize os valores iniciais ao carregar a página
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return loading
        ? <LoadingPage progress={session === undefined ? 50 : 100} />
        : <div
            style={{
                width: `${windowWidth}px`,
                height: `${windowHeight}px`,
            }}
        >
            {showNavbar &&
                <Navbar session={session} signIn={signIn} signOut={signOut} />
            }
            <div
                id={styles.componentContainer}
                style={{
                    height: showNavbar
                        ? '91%'
                        : '100%'
                }}
            >
                <Component{...pageProps} session={session} signIn={signIn} setShowNavbar={setShowNavbar} />
            </div>
        </div >
}