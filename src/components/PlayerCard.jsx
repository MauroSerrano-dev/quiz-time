import { Avatar } from '@mui/material'
import styles from '../styles/components/PlayerCard.module.css'

export default function PlayerCard(props) {
    const { player, progress, top, zIndex, width, height } = props

    return (
        <div id={styles.container} style={{ top: top ? top : 0, zIndex: zIndex ? zIndex : 0, width: width, height: height }}>
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
