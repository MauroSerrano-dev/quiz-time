import { Avatar } from '@mui/material'
import styles from '../styles/components/PlayerCard.module.css'
import { motion } from "framer-motion"

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
}

export default function PlayerCard(props) {
    const { player, progress, top, zIndex, width, height } = props

    return (
        <motion.div
            id={styles.container}
            style={{ top: top ? top : 0, zIndex: zIndex ? zIndex : 0, width: width, height: height }}
            variants={item}
        >
            <div id={styles.avatarContainer}>
                <Avatar src={player.user.image} />
            </div>
            <div id={styles.infos} className='flex-center'>
                <p id={styles.name}>{player.user.name}</p>
                <div id={styles.progressBarContainer}>
                    <div id={styles.bar} style={{ left: `${progress - 100}%` }}></div>
                </div>
            </div>
        </motion.div>
    )
}
