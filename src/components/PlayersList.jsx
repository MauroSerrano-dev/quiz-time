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

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0,
            delayChildren: 0.25,
            duration: 0.2,
        }
    }
}

export default function PlayersList(props) {
    const {
        players,
        totalQuestions,
        noProgressBar,
    } = props
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(players)
    const [showPlayers, setShowPlayers] = useState(false)

    function handleTabClick() {
        setOpen(prev => !prev)
        if (!showPlayers)
            setShowPlayers(prev => !prev)
        else {
            setTimeout(() => setShowPlayers(prev => !prev), 205)
        }
    }

    const styleOpen = {
        right: `${ITEM_SIZE.width * 0.545}px`
    }

    const styleClose = {
    }

    useEffect(() => {
        const tempPlayers = [...players]
        const sortedPlayers = tempPlayers.sort((a, b) =>
            Object.keys(b.answers ? b.answers : {}).length !== Object.keys(a.answers ? a.answers : {}).length
                ? Object.keys(b.answers ? b.answers : {}).length - Object.keys(a.answers ? a.answers : {}).length
                : new Date(a.lastAnswerDate) - new Date(b.lastAnswerDate)
        )
        setItems(players.map(player => { return { ...player, position: sortedPlayers.findIndex(p => p.user.email === player.user.email) } }))
    }, [players])

    return (
        <div
            id={styles.container}
            style={{ right: open ? `${ITEM_SIZE.width * 0.54}px` : `-${ITEM_SIZE.width * 0.6}px` }}
        >
            <div
                id={styles.tabContainer}
                onClick={handleTabClick}
                style={open ? styleOpen : styleClose}
            >
                <p>{players.length} {players.length === 1 ? 'Player' : 'Players'}</p>
            </div>
            <div id={styles.playersContainer} style={{ paddingTop: `${LIST_SIZE.paddingTop}px` }}>
                <motion.div
                    id={styles.players}
                    style={{ gap: `${LIST_SIZE.gap}px` }}
                    variants={container}
                    initial="hidden"
                    animate={showPlayers ? "visible" : "hidden"}
                >
                    {items.map((player, i) =>
                        <PlayerCard
                            key={`Player: ${i}`}
                            player={player}
                            progress={
                                totalQuestions && !noProgressBar
                                    ? (Object.keys(player.answers ? player.answers : {}).length / totalQuestions) * 100
                                    : undefined
                            }
                            top={`${(LIST_SIZE.paddingTop + 1) + ((ITEM_SIZE.height + LIST_SIZE.gap) * player.position)}px`}
                            zIndex={players.length - player.position}
                            width={`${ITEM_SIZE.width}px`}
                            height={`${ITEM_SIZE.height}px`}
                        />
                    )}
                    {players.map((player, i) =>
                        <div key={`Placer ${i}`} style={{ width: `${ITEM_SIZE.width}px`, height: `${ITEM_SIZE.height}px` }}></div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}