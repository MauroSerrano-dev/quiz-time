import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import { Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

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
        const options = { method: 'GET' }
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } })

        socket.on("getData", (room) => {
            setRoom(room)
            setDisableShow(room.state === 'disable')
            setActiveShow(room.state === 'active')
        });

        socket.on("updateFields", (roomAttFields) => {
            const firstKey = Object.keys(roomAttFields)[0]
            if (firstKey.includes('players') && firstKey !== 'players') {
                setRoom(prev => { return { ...prev, players: prev.players.filter(player => player.email !== roomAttFields[firstKey].email).concat(roomAttFields[firstKey]) } })
            }
            else {
                if (Object.keys(roomAttFields).some(field => field === 'state')) {
                    setDisableShow(roomAttFields.state === 'disable')
                    setActiveShow(roomAttFields.state === 'active')
                }
                setRoom(prev => { return { ...prev, ...roomAttFields } })
            }
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
                                        <div id={styles.qrContainer}>
                                            <div id={styles.qrCode}><QRCode value={`quiztime.pt/quiz?code=${code}`} size={200} ecLevel='H' qrStyle='dots' logoImage='quiz-time-logo.png' logoWidth={200 * 0.6} logoOpacity={0.5} eyeColor={{ outer: '#00a0dc', inner: '#005270' }} eyeRadius={5} /></div>
                                            <h2>Scan Me!</h2>
                                            <div className={styles.frame}></div>
                                            <div className={styles.frame} id={styles.border}></div>
                                            <div id={styles.textContainer}></div>
                                        </div>
                                        <h2>Ou</h2>
                                        <div id={styles.linkContainer}>
                                            <h2>Entre no link:</h2>
                                            <a href={`${process.env.SITE_URL}/quiz?code=${code}`} target='_blank'>
                                                <h2>{process.env.SITE_URL}/quiz?code={code}</h2>
                                            </a>
                                        </div>
                                        <a href={`${process.env.SITE_URL}/controller?code=${code}`} target='_blank'>
                                            <Button variant="outlined" endIcon={<SportsEsportsIcon />}>
                                                Controller
                                            </Button>
                                        </a>
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
                                                <div id={styles.questionContainer}>
                                                    <h2>{room.currentQuestion + 1}. {quiz.questions[room.currentQuestion].content}</h2>
                                                </div>
                                                <div id={styles.optionsContainer}>
                                                    {quiz.questions[room.currentQuestion].options.map((option, i) =>
                                                        <Button id={styles.optionButton} variant="outlined" key={`Option: ${i}`}><h3>{option.content}</h3></Button>
                                                    )}
                                                </div>
                                            </section>
                                        }
                                    </motion.div>
                                }
                                {room.state === 'finish' &&
                                    <div>
                                        <h2>Finalizado</h2>
                                    </div>
                                }
                                {room.state === 'results' &&
                                    <div>
                                        <h2>Finalizado</h2>
                                    </div>
                                }
                                <div id={styles.playersList}>
                                    <h3>Players</h3>
                                    <ol>
                                        {room.players.map((player, i) => <li key={`Player: ${i}`}><p>{player.name} {player.answers.some((answer, i) => i === room.currentQuestion) ? 'check' : ''}</p></li>)}
                                    </ol>
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