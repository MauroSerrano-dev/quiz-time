import { useEffect, useState } from 'react'
import styles from '../styles/components/Modal.module.css'
import { motion } from "framer-motion"

export default function Modal(props) {
    const { closeModal, body, foot, head, showModalOpacity, height, width } = props

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
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
                className={styles.container}
                initial={{ opacity: 0 }}
                animate={showModalOpacity ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: showModalOpacity ? 0.5 : 0.3, ease: [.62, -0.18, .32, 1.17] }}
            >
                <div className={styles.background} onClick={closeModal}></div>
                <motion.div
                    className={styles.modal}
                    style={{ width: width, height: height, minWidth: '250px', minHeight: '350px' }}
                    initial={{ scale: 0.7 }}
                    animate={showModalOpacity ? { scale: 1 } : { scale: 0.7 }}
                    transition={{ duration: showModalOpacity ? 0.5 : 0.3, ease: [.62, -0.18, .32, 1.17] }}
                >
                    <div className={styles.content}>
                        <div className={styles.head}>{head}</div>
                        <div className={styles.body}>{body}</div>
                        <div className={styles.foot}>{foot}</div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
