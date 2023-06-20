
import styles from '../styles/components/LoadingPage.module.css'
import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import Logo from './Logo'

export default function LoadingPage() {
    const [showCircle, setShowCircle] = useState(false)

    useEffect(() => {
        setShowCircle(true)
    }, [])

    return (
        <div id={styles.loadingContainer}>
            <Logo width='50%' />
            {showCircle && <CircularProgress />}
        </div>
    )
}
