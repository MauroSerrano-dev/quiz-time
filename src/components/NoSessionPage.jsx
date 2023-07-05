
import styles from '../styles/components/NoSessionPage.module.css'
import { Button } from '@mui/material';
import Logo from './Logo';

export default function NoSessionPage(props) {
    const { signIn } = props

    return (
        <div id={styles.noSessionContainer}>
            <Logo width='40%' />
            <Button variant="outlined" onClick={signIn}>Login</Button>
        </div>
    )
}