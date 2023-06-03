
import styles from '../styles/components/LoadingPage.module.css'
import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

export default function LoadingPage() {
    const [showCircle, setShowCircle] = useState(false)

    useEffect(() => {
        setShowCircle(true)
    }, [])

    return (
        <div id={styles.loadingContainer}>
            <img id={styles.logo} src='/quiz-time-logo.png' />
            {showCircle && <CircularProgress />}
        </div>
    )
}
