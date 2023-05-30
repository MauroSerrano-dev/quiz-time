import { useEffect, useState } from 'react'
import styles from '../styles/components/PlayersList.module.css'
import PlayerCard from './PlayerCard'
import { motion } from "framer-motion"

const ITEM_SIZE = {
    width: 250,
    height: 70,
}
const LIST_SIZE = {
    paddingTop: 8,
    gap: 8,
}

export default function PlayersList(props) {
    const { players, totalQuestions } = props
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(players)

    function switchOpen() {
        setOpen(prev => !prev)
    }

    const styleOpen = {
        right: `${ITEM_SIZE.width * 0.545}px`
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
            style={{ right: open ? `${ITEM_SIZE.width * 0.56}px` : `-${ITEM_SIZE.width * 0.56}px` }}
        >
            <div
                id={styles.tabContainer}
                onClick={switchOpen}
                style={open ? styleOpen : styleClose}
            >
                <p>Players</p>
            </div>
            <div id={styles.playersContainer} style={{ paddingTop: `${LIST_SIZE.paddingTop}px` }}>
                <div id={styles.players} style={{ gap: `${LIST_SIZE.gap}px` }}>
                    {items.map((player, i) =>
                        <PlayerCard
                            key={`Player: ${i}`}
                            player={player}
                            progress={(player.answers.length / totalQuestions) * 100}
                            top={`${(LIST_SIZE.paddingTop + 1) + ((ITEM_SIZE.height + LIST_SIZE.gap) * player.position)}px`}
                            zIndex={players.length - player.position}
                            width={`${ITEM_SIZE.width}px`}
                            height={`${ITEM_SIZE.height}px`}
                        />
                    )}
                    {players.map((player, i) =>
                        <div key={`Placer ${i}`} style={{ width: `${ITEM_SIZE.width}px`, height: `${ITEM_SIZE.height}px` }}></div>
                    )}
                </div>
            </div>
        </div>
    )
}