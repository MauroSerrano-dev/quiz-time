import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { useRouter } from 'next/router'
import { Button } from '@mui/material';

const MENU_LIST = [
    { name: 'Main', href: '/' },
    { name: 'Lobby', href: '/lobby' },
    { name: 'Quiz Builder', href: '/quiz-builder' },
    { name: 'Configuration', href: '/configuration' },
    { name: 'Support', href: '/support' },
]

export default function Navbar(props) {
    const { session, signIn, signOut } = props
    const [navActive, setNavActive] = useState(false)
    const { pathname } = useRouter()

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <Link legacyBehavior href={'/'}>
                        <a>
                            <img className={styles.logo} src='/quiz-time-logo.png' />
                        </a>
                    </Link>
                </div>
                <div className={styles.middle}>
                    <div className={`${navActive ? styles.active : ''} ${styles.nav_menu_list}`}>
                        {MENU_LIST.map((option, i) =>
                            <div onClick={() => { setNavActive(false) }}
                                key={option.name}>
                                <Link legacyBehavior href={option.href}>
                                    <a>
                                        <h1 className={`${styles.navOption} ${option.href === pathname ? styles.currentPage : ''}`}>{option.name}</h1>
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.rightSide}>
                    {session &&
                        <div className={styles.rightSideLogin}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.userName}>
                                    <p>{session.user.name}</p>
                                </div>
                            </div>
                            <Button variant="outlined" size='small' onClick={() => signOut()}>Sign out</Button>
                        </div>
                    }
                    {!session &&
                        <div>
                            <Button variant="outlined" size='small' onClick={() => signIn()}>Sign in</Button>
                        </div>
                    }
                    <div onClick={() => setNavActive(!navActive)} className={styles.nav_menu_bar}>
                        <div className={`${navActive ? styles.active2 : styles.disactive} ${styles.navButton}`}></div>
                        <div className={`${navActive ? styles.active : styles.disactive2} ${styles.navButton}`}></div>
                        <div className={`${navActive ? styles.active2 : styles.disactive3} ${styles.navButton}`}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}