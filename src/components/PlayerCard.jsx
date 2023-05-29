import { Avatar } from '@mui/material'
import styles from '../styles/components/PlayerCard.module.css'

export default function PlayerCard(props) {
    const { player } = props

    return (
        <div id={styles.container} className='flex-row-center'>
            <Avatar src={player.user.image} />
            <p>{player.user.name}</p>
        </div>
    )
}
