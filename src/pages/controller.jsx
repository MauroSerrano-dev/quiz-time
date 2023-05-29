import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/controller.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import { Button, ButtonGroup } from '@mui/material';

let socket;

export default withRouter((props) => {
    const { session } = props
    const [room, setRoom] = useState()
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [quiz, setQuiz] = useState()

    const { code } = props.router.query

    useEffect(() => {
        if (!room) {
            socketInitializer()
        }
    }, [session])

    useEffect(() => {
        if (room && !quiz) {
            getQuiz()
        }
    }, [room])

    const socketInitializer = async () => {
        const options = {
            method: 'GET'
        }
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } })

        socket.on("getData", (room) => {
            setRoom(room)
            setDisableShow(room.state === 'disable')
            setActiveShow(room.state === 'active')
        });

        socket.on(`updateFieldsRoom${code}`, (roomAttFields) => {
            const firstKey = Object.keys(roomAttFields)[0]
            if (firstKey.includes('players') && firstKey !== 'players') {
                setRoom(prev => { return { ...prev, players: prev.players.filter(player => player.email !== roomAttFields[firstKey].email).concat(roomAttFields[firstKey]) } })
            }
            else
                setRoom(prev => { return { ...prev, ...roomAttFields } })
        })

    }

    async function getQuiz() {
        const options = {
            method: 'GET',
            headers: { "quizname": room.quizInfo.name },
        }

        await fetch(room.quizInfo.type === 'standard' ? '/api/quizzesStandard' : '/api/quizzesCustom', options)
            .then(response => response.json())
            .then(response => setQuiz(response.quiz))
            .catch(err => console.error(err))
    }

    const nextQuestion = async () => {
        if (room.currentQuestion >= quiz.questions.length - 1)
            socket.emit("updateRoom", { ...room, state: 'finish' })
        else
            socket.emit("updateRoom", { ...room, currentQuestion: room.currentQuestion + 1 })
    }

    const prevQuestion = async () => {
        if (room.currentQuestion > 0)
            socket.emit("updateRoom", { ...room, currentQuestion: room.currentQuestion - 1 })
    }

    async function showResults() {
        socket.emit("updateRoom", { ...room, state: 'results' })
    }

    const resetQuiz = async () => {
        setDisableShow(true)
        setActiveShow(false)
        setTimeout(() => {
            socket.emit("updateRoom", { ...room, state: 'disable', currentQuestion: 0, players: [] })
        }, 600)
    }

    const startQuiz = async () => {
        setDisableShow(false)
        setActiveShow(true)
        setTimeout(() => {
            socket.emit("updateRoom", { ...room, state: 'active' })
        }, 600)
    }

    async function switchControl(isControl) {
        socket.emit("updateRoom", { ...room, control: isControl })
    }

    return (
        <div id={styles.container}>
            <main>
                {room && Object.keys(room).length === 0 &&
                    <div>
                        <h1 id={styles.roomName}>Esta sala não existe</h1>
                    </div>
                }
                {room && Object.keys(room).length > 0 &&
                    <div id={styles.roomContainer}>
                        <h1 id={styles.roomName}>Essa é a sala: {room.name}</h1>
                        {session.user.email === room.owner &&
                            <section id={styles.ownerView}>
                                {room.state === 'disable' &&
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={disableShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                                        transition={{ delay: disableShow ? 0.5 : 0, duration: disableShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                        id={styles.disableContainer}
                                    >
                                        <ButtonGroup>
                                            <Button sx={{ width: '120px' }} variant={room.control ? 'outlined' : 'contained'} onClick={() => switchControl(false)}>Auto-Play</Button>
                                            <Button sx={{ width: '120px' }} variant={room.control ? 'contained' : 'outlined'} onClick={() => switchControl(true)}>Control</Button>
                                        </ButtonGroup>
                                        <Button variant="outlined" onClick={startQuiz}>Start Quiz</Button>
                                    </motion.div>}
                                {room.state === 'active' && quiz &&
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={activeShow ? { opacity: 1 } : { opacity: 0 }}
                                        transition={{ delay: activeShow ? 0.5 : 0, duration: activeShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                        id={styles.activeContainer}
                                    >
                                        {room.control &&
                                            <section id={styles.questionOptions}>
                                                <div>
                                                    <Button variant="contained" onClick={prevQuestion} disabled={room.currentQuestion === 0}>Prev Question</Button>
                                                    <Button variant="contained" onClick={nextQuestion}>Next Question</Button>
                                                </div>
                                            </section>
                                        }
                                        <Button variant="outlined" onClick={resetQuiz}>Reset Quiz</Button>
                                    </motion.div>
                                }
                                {room.state === 'finish' &&
                                    <div>
                                        <Button variant="outlined" onClick={showResults}>Mostrar Resultados</Button>
                                    </div>
                                }
                                {room.state === 'results' &&
                                    <div>
                                        <h2>Finalizado</h2>
                                    </div>
                                }
                                <div id={styles.playersList}>
                                    <h3>Players</h3>
                                    {room.players.map((player, i) =>
                                        <p key={`Player: ${i}`}>{player.name} {player.answers.some((answer) => answer.questionIndex === room.currentQuestion) ? 'check' : ''}</p>
                                    )}
                                </div>
                            </section>
                        }
                        {session.user.email !== room.owner &&
                            <div>
                                <h3>Esta é a visão de quem não é dono da sala</h3>
                            </div>
                        }
                    </div>
                }
            </main>
        </div>
    )
})