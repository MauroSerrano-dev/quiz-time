import { useEffect, useState } from 'react'
import styles from '../styles/components/Modal.module.css'
import { motion } from "framer-motion"

export default function Modal(props) {
    const {
        closeModal,
        body,
        foot,
        head,
        showModalOpacity,
        width,
        height,
        widthMobile,
        heightMobile,
        widthSmall,
        heightSmall,
    } = props
    const [isMobile, setIsMobile] = useState(window.innerWidth >= 361 && window.innerWidth <= 700)
    const [isSmall, setIsSmall] = useState(window.innerWidth <= 360)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth >= 361 && window.innerWidth <= 700)
            setIsSmall(window.innerWidth <= 360)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)
    }, [])

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            event.preventDefault()
            closeModal()
            event.target.blur()
        }
    }

    return (
        <div>
            <motion.div
                id={styles.container}
                initial={{ opacity: 0 }}
                animate={showModalOpacity ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: showModalOpacity ? 0.5 : 0.3, ease: [.62, -0.18, .32, 1.17] }}
            >
                <div id={styles.background} onClick={closeModal}></div>
                <motion.div
                    id={styles.modal}
                    initial={{
                        scale: 0.7,
                        width: isMobile ? widthMobile : (isSmall ? widthSmall : width),
                        height: isMobile ? heightMobile : (isSmall ? heightSmall : height),
                    }}
                    animate={{
                        scale: showModalOpacity ? 1 : 0.7,
                        width: isMobile ? widthMobile : (isSmall ? widthSmall : width),
                        height: isMobile ? heightMobile : (isSmall ? heightSmall : height),
                    }}
                    transition={{ duration: showModalOpacity ? 0.5 : 0.3, ease: [.62, -0.18, .32, 1.17] }}
                >
                    <div id={styles.content}>
                        <div id={styles.head}>{head}</div>
                        <div id={styles.body}>{body}</div>
                        <div id={styles.foot}>{foot}</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
