import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import $ from 'jquery'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import { motion } from "framer-motion"

let socket;

const quizName = 'Perfil Comportamental'

export default withRouter((props) => {
    const [room, setRoom] = useState()
    const { data: session } = useSession()
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [quiz, setQuiz] = useState()

    const { code } = props.router.query

    useEffect(() => {
        if (session && !room) {
            socketInitializer()
        }
    }, [session])

    const socketInitializer = async () => {
        const options = {
            method: 'GET',
            headers: { code: code },
        };
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } })

        socket.on("getData", (room) => {
            setRoom(room)
            setDisableShow(room.state === 'disable')
            setActiveShow(room.state === 'active')
        });

        socket.on("updateFields", (roomAttFields) => {
            setRoom(prev => { return { ...prev, ...roomAttFields } })
        });
    };

    const nextQuestion = async () => {
        if (room.currentQuestion >= 24)
            socket.emit("updateRoom", { ...room, state: 'finish' })
        else
            socket.emit("updateRoom", { ...room, currentQuestion: room.currentQuestion + 1 })
    }

    const resetQuestions = async () => {
        socket.emit("updateRoom", { ...room, currentQuestion: 0 })
    }

    const startQuiz = async () => {
        setDisableShow(false)
        setActiveShow(true)
        setTimeout(() => {
            socket.emit("updateRoom", { ...room, state: 'active' })
        }, 600)
    }

    const disableQuiz = async () => {
        setDisableShow(true)
        setActiveShow(false)
        setTimeout(() => {
            socket.emit("updateRoom", { ...room, state: 'disable' })
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
                        <h1 className={styles.roomName}>Essa é a sala: {code}</h1>
                        {room.state === 'disable' &&
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={disableShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                                transition={{ delay: disableShow ? 0.5 : 0, duration: disableShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                className={styles.disableContainer}
                            >
                                <div className={styles.qrContainer}>
                                    <div className={styles.qrCode}><QRCode value={`quiz-maker.herokuapp.com/quiz?code=${code}`} size={200} ecLevel='H' qrStyle='dots' logoImage='quiz-time-logo.png' logoWidth={200 * 0.6} logoOpacity={0.5} eyeColor={{ outer: '#00a0dc', inner: '#005270' }} eyeRadius={5} /></div>
                                    <h2>Scan Me!</h2>
                                    <div className={styles.frame}></div>
                                    <div className={`${styles.frame} ${styles.border}`}></div>
                                    <div className={styles.textContainer}></div>
                                </div>
                                <button onClick={startQuiz}>Start Quiz</button>
                            </motion.div>}
                        {room.state === 'active' &&
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={activeShow ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: activeShow ? 0.5 : 0, duration: activeShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                className={styles.activeContainer}
                            >
                                <button onClick={nextQuestion}>Next Question</button>
                                <button onClick={resetQuestions}>Reset Questions</button>
                                <button onClick={disableQuiz}>Disable Quiz</button>
                            </motion.div>
                        }
                        {room.state === 'finish' &&
                            <div>
                                <button onClick={resetQuestions}>Reset Questions</button>
                                <button onClick={disableQuiz}>Disable Quiz</button>
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
            </main>
        </div>
    );
})