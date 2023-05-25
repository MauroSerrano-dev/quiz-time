import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/components/NavBar.module.css'
import { useRouter } from 'next/router'
import { Button } from '@mui/material';
import AvatarMenu from './AvatarMenu';
import { MenuToggle } from './MenuToggle';
import { useCycle } from 'framer-motion';

const MENU_LIST = [
    { name: 'Lobby', href: '/lobby' },
    { name: 'Quiz Builder', href: '/quiz-builder' },
]

export default function Navbar(props) {
    const { session, signIn, signOut } = props
    const [navActive, setNavActive] = useState(false)
    const { pathname } = useRouter()
    const [isOpen, toggleOpen] = useCycle(false, true);

    return (
        <div id={styles.container}>
            <div id={styles.leftSide}>
                {/* <MenuToggle toggle={() => toggleOpen()} /> */}
                <Link legacyBehavior href={'/'}>
                    <a>
                        <img id={styles.logo} src='/quiz-time-logo.png' />
                    </a>
                </Link>
            </div>
            <div id={styles.middle}>
                <div className={`${navActive ? styles.active : ''} ${styles.nav_menu_list}`}>
                    {MENU_LIST.map((option, i) =>
                        <div onClick={() => { setNavActive(false) }}
                            key={option.name}>
                            <Link legacyBehavior href={option.href}>
                                <a>
                                    <h1 className={styles.navOption} id={option.href === pathname ? styles.currentPage : ''}>{option.name}</h1>
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div id={styles.rightSide}>
                {session &&
                    <div id={styles.rightSideLogin}>
                        <h2>{session.user.plan.name}</h2>
                        <AvatarMenu session={session} signOut={signOut} />
                    </div>
                }
                {!session &&
                    <div>
                        <Button variant="outlined" id={styles.loginButton} onClick={() => signIn()}>Sign in</Button>
                    </div>
                }
                <div onClick={() => setNavActive(!navActive)} id={styles.nav_menu_bar}>
                    <div className={`${navActive ? styles.active2 : styles.disactive} ${styles.navButton}`}></div>
                    <div className={`${navActive ? styles.active : styles.disactive2} ${styles.navButton}`}></div>
                    <div className={`${navActive ? styles.active2 : styles.disactive3} ${styles.navButton}`}></div>
                </div>
            </div>
        </div>
    )
}