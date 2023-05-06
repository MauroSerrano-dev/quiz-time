import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/components/NavBar.module.css'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"

const MENU_LIST = [
    { name: 'Main', href: '/' },
    { name: 'Lobby', href: '/lobby' },
    { name: 'Quiz Builder', href: '/quiz-builder' },
    { name: 'Configuration', href: '/configuration' },
    { name: 'Support', href: '/support' },
]

export default function NavBar() {
    const { data: session } = useSession()
    const [navActive, setNavActive] = useState(false)
    const { pathname } = useRouter()

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    {/* <div className={styles.darkModeButton}>
                        <DarkModeButton />
                    </div> */}
                    <Link legacyBehavior href={'/'}>
                        <a>
                            <img className={styles.logo} src='/quiz-time-logo.png' />
                            <h1 className={styles.title}>Quiz Time</h1>
                        </a>
                    </Link>
                </div>
                <div onClick={() => setNavActive(!navActive)} className={styles.nav_menu_bar}>
                    <div className={`${navActive ? styles.active2 : styles.disactive} ${styles.navButton}`}></div>
                    <div className={`${navActive ? styles.active : styles.disactive2} ${styles.navButton}`}></div>
                    <div className={`${navActive ? styles.active2 : styles.disactive3} ${styles.navButton}`}></div>
                </div>

                <div className={`${navActive ? styles.active : ''} ${styles.nav_menu_list}`}>
                    {MENU_LIST.map((option, i) => {
                        return (
                            <div onClick={() => { setNavActive(false) }}
                                key={option.name}>
                                <Link legacyBehavior href={option.href}>
                                    <a>
                                        <h1 className={`${styles.navOption} ${option.href === pathname ? styles.currentPage : ''}`}>{option.name}</h1>
                                    </a>
                                </Link>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.rightSide}>
                    {session &&
                        <div className={styles.rightSideLogin}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.userName}>
                                    {session.user.name}
                                </div>
                            </div>
                            <button onClick={() => signOut()}>Sign out</button>
                        </div>
                    }
                    {!session &&
                        <div>
                            <button onClick={() => signIn()}>Sign in</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}