
import styles from '../styles/components/NoSessionPage.module.css'
import { Button } from '@mui/material';

export default function NoSessionPage(props) {
    const { signIn } = props

    return (
        <div id={styles.noSessionContainer}>
            <img id={styles.logo} src='/quiz-time-logo.png' />
            <Button variant="outlined" onClick={signIn}>Sign in</Button>
        </div>
    )
}
