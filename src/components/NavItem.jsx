import React from "react"
import Link from 'next/link'
import styles from '@/styles/components/NavItem.module.css'

const NavItem = ({ href, text, active }) => {
    return(
        <Link legacyBehavior href={href}>
            <a className={`${styles.nav_link} ${active ? 'active' : ''}`}>
                {text}
            </a>
        </Link>
    )
}

export default NavItem