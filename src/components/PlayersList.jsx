import { useState } from 'react'
import styles from '../styles/components/PlayersList.module.css'
import PlayerCard from './PlayerCard'

export default function PlayersList(props) {
    const { players } = props
    const [open, setOpen] = useState(false)

    function switchOpen() {
        setOpen(prev => !prev)
    }

    const styleOpen = {
        right: '0px',
        paddingRight: '0px'
    }

    const styleClose = {
        right: '-225px',
    }

    return (
        <div
            id={styles.container}
            style={open ? styleOpen : styleClose}
        >
            <div
                id={styles.tabContainer}
                onClick={switchOpen}
            >
                <p>Players</p>
            </div>
            <div id={styles.playersContainer}>
                <div id={styles.players}>
                    {players.map((player, i) => <PlayerCard key={`Player: ${i}`} player={player} ></PlayerCard>)}
                </div>
            </div>
        </div>
    )
}