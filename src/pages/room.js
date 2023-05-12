import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"

let socket;

export default withRouter((props) => {
    const { session } = props
    const [room, setRoom] = useState()
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [quiz, setQuiz] = useState()

    const { code } = props.router.query

    useEffect(() => {
        if (session && !room) {
            socketInitializer()
        }
    }, [session])

    useEffect(() => {
        if (room && !quiz) {
            getQuiz()
        }
    }, [room])

    const socketInitializer = async () => {
        const options = { method: 'GET' }
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } })

        socket.on("getData", (room) => {
            setRoom(room)
            setDisableShow(room.state === 'disable')
            setActiveShow(room.state === 'active')
        });

        socket.on("updateFields", (roomAttFields) => {
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

    return (
        <div>
            <main>
                {room && Object.keys(room).length === 0 &&
                    <div>
                        <h1 className={styles.roomName}>Esta sala não existe</h1>
                    </div>
                }
                {room && Object.keys(room).length > 0 &&
                    <div>
                        <h1 className={styles.roomName}>Essa é a sala: {room.name}</h1>
                        {session.user.email === room.owner &&
                            <div>

                                {room.state === 'disable' &&
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={disableShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                                        transition={{ delay: disableShow ? 0.5 : 0, duration: disableShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                        className={styles.disableContainer}
                                    >
                                        <div className={styles.qrContainer}>
                                            <div className={styles.qrCode}><QRCode value={`quiztime.pt/quiz?code=${code}`} size={200} ecLevel='H' qrStyle='dots' logoImage='quiz-time-logo.png' logoWidth={200 * 0.6} logoOpacity={0.5} eyeColor={{ outer: '#00a0dc', inner: '#005270' }} eyeRadius={5} /></div>
                                            <h2>Scan Me!</h2>
                                            <div className={styles.frame}></div>
                                            <div className={`${styles.frame} ${styles.border}`}></div>
                                            <div className={styles.textContainer}></div>
                                        </div>
                                        <button onClick={startQuiz}>Start Quiz</button>
                                    </motion.div>}
                                {room.state === 'active' && quiz &&
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={activeShow ? { opacity: 1 } : { opacity: 0 }}
                                        transition={{ delay: activeShow ? 0.5 : 0, duration: activeShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                        className={styles.activeContainer}
                                    >
                                        <div className={styles.questionContainer}>
                                            <h2>{quiz.questions[room.currentQuestion].content}</h2>
                                        </div>
                                        <div className={styles.optionsContainer}>
                                            <button>{quiz.questions[room.currentQuestion].options[0].content}</button>
                                            <button>{quiz.questions[room.currentQuestion].options[1].content}</button>
                                            <button>{quiz.questions[room.currentQuestion].options[2].content}</button>
                                            <button>{quiz.questions[room.currentQuestion].options[3].content}</button>
                                        </div>
                                        <button onClick={prevQuestion} disabled={room.currentQuestion === 0}>Prev Question</button>
                                        <button onClick={nextQuestion}>Next Question</button>
                                        <button onClick={resetQuiz}>Reset Quiz</button>
                                    </motion.div>
                                }
                                {room.state === 'finish' &&
                                    <div>
                                        <button onClick={showResults}>Mostrar Resultados</button>
                                    </div>
                                }
                                {room.state === 'results' &&
                                    <div>
                                        <h2>Finalizado</h2>
                                    </div>
                                }
                                <div>
                                    <h3>Players</h3>
                                    <ol>
                                        {room.players.map((player, i) => <li key={`Player: ${i}`}><p>{player.name} {player.answers.some((answer, i) => i === room.currentQuestion) ? 'check' : ''}</p></li>)}
                                    </ol>
                                </div>
                            </div>
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