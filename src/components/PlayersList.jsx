import { useEffect, useState } from 'react'
import styles from '../styles/components/PlayersList.module.css'
import PlayerCard from './PlayerCard'
import { motion } from "framer-motion"

export default function PlayersList(props) {
    const { players, totalQuestions } = props
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(players)

    function switchOpen() {
        setOpen(prev => !prev)
    }

    const styleOpen = {
        marginRight: '0px'
    }

    const styleClose = {
    }

    useEffect(() => {
        const tempPlayers = [...players]
        const sortedPlayers = tempPlayers.sort((a, b) =>
            b.answers.length !== a.answers.length
                ? b.answers.length - a.answers.length
                : new Date(a.lastAnswerDate) - new Date(b.lastAnswerDate)
        )

        setItems(players.map(player => { return { ...player, position: sortedPlayers.findIndex(p => p.user.email === player.user.email) } }))
    }, [players])

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
                    {items.map((player, i) =>
                        <PlayerCard
                            key={`Player: ${i}`}
                            player={player}
                            progress={(player.answers.length / totalQuestions) * 100}
                            top={`${9 + (79 * player.position)}px`}
                            zIndex={players.length - player.position}
                        />
                    )}
                    {players.map((player, i) =>
                        <div key={`Placer ${i}`} id={styles.placer}></div>
                    )}
                </div>
            </div>
        </div>
    )
}