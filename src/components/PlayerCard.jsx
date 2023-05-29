import { Avatar } from '@mui/material'
import styles from '../styles/components/PlayerCard.module.css'

export default function PlayerCard(props) {
    const { player, progress } = props

    return (
        <div id={styles.container} className='flex-row-start'>
            <div id={styles.avatarContainer}>
                <Avatar src={player.user.image} />
            </div>
            <div id={styles.infos} className='flex-center'>
                <p id={styles.name}>{player.user.name}</p>
                <div id={styles.progressBarContainer}>
                    <div id={styles.bar} style={{ left: `${progress - 100}%` }}></div>
                </div>
            </div>
        </div>
    )
}
