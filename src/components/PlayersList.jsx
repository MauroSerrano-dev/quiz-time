import { useState } from 'react'
import styles from '../styles/components/PlayersList.module.css'
import PlayerCard from './PlayerCard'

export default function PlayersList(props) {
    const { players, totalQuestions } = props
    const [open, setOpen] = useState(false)

    function switchOpen() {
        setOpen(prev => !prev)
    }

    const styleOpen = {
        marginRight: '0px'
    }

    const styleClose = {
    }

    return (
        <div
            id={styles.container}
            style={{ right: open ? '0px' : '-299px' }}
        >
            <div
                id={styles.tabContainer}
                onClick={switchOpen}
                style={open ? styleOpen : styleClose}
            >
                <p>Players</p>
            </div>
            <div id={styles.playersContainer}>
                <div id={styles.players}>
                    {players.concat(players).concat(players).concat(players).map((player, i) =>
                        <PlayerCard key={`Player: ${i}`} player={player} progress={(player.answers.length / totalQuestions) * 100} ></PlayerCard>
                    )}
                </div>
            </div>
        </div>
    )
}