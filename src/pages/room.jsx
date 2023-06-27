import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import { Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PlayersList from '@/components/PlayersList';
import NoSessionPage from '@/components/NoSessionPage';
import { getStandardQuiz, getUserQuiz } from '../../utils/api-caller';

let socket;

export default withRouter((props) => {
    const { session, signIn } = props
    const [room, setRoom] = useState()
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [noRoom, setNoRoom] = useState(false)
    const [quiz, setQuiz] = useState()

    const { code } = props.router.query

    useEffect(() => {
        if (!room && code && session) {
            socketInitializer()
        }
    }, [session, code])

    useEffect(() => {
        if (room && !quiz) {
            async function getQuiz() {
                if (true)
                    return await getUserQuiz(session.user.id, '32b1aa1b-7106-4ad5-9bd6-4adb5f197ee9')
                if (room.quizInfo.type === 'standard')
                    return await getStandardQuiz(session.user.id, '32b1aa1b-7106-4ad5-9bd6-4adb5f197ee9')
            }
            getQuiz()
                .then(response => response.json())
                .then(response => setQuiz(response.quiz))
                .catch(err => console.error(err))
        }
    }, [room])

    const socketInitializer = async () => {
        const options = {
            method: 'GET'
        }
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } })

        socket.on("getData", (room) => {
            if (room) {
                setRoom(room)
                setDisableShow(room.state === 'disable')
                setActiveShow(room.state === 'active')
            }
            else {
                setNoRoom(true)
            }
        })

        socket.on(`updateFieldsRoom${code}`, (att) => {
            const { roomAtt } = att
            setDisableShow(roomAtt.state === 'disable')
            setActiveShow(roomAtt.state === 'active')
            setRoom(roomAtt)
        })
    }

    return (
        <div>
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <div id={styles.container}>
                    <main>
                        {!room && noRoom &&
                            <div>
                                <h1 id={styles.roomName}>Esta sala não existe</h1>
                            </div>
                        }
                        {room &&
                            <div id={styles.roomContainer}>
                                <h1 id={styles.roomName}>Essa é a sala: {room.name}</h1>
                                {session.user.id === room.owner.id &&
                                    <section id={styles.ownerView}>
                                        {room.state === 'disable' &&
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={disableShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                                                transition={{ delay: disableShow ? 0.5 : 0, duration: disableShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                                id={styles.disableContainer}
                                            >
                                                <div id={styles.qrContainer}>
                                                    <div id={styles.qrCode}>
                                                        <QRCode
                                                            value={`${process.env.NEXT_PUBLIC_SITE_DOMAIN}/quiz?code=${code}`}
                                                            size={200}
                                                            ecLevel='H'
                                                            qrStyle='dots'
                                                            logoImage='logos/logo-white-blue.png'
                                                            logoWidth={200 * 0.9}
                                                            logoOpacity={0.5}
                                                            eyeColor={{
                                                                outer: '#00a0dc',
                                                                inner: '#005270'
                                                            }}
                                                            eyeRadius={5} />
                                                    </div>
                                                    <h2>Scan Me!</h2>
                                                    <div className={styles.frame}></div>
                                                    <div className={styles.frame} id={styles.border}></div>
                                                    <div id={styles.textContainer}></div>
                                                </div>
                                                <h2>Ou</h2>
                                                <div id={styles.linkContainer}>
                                                    <h2>Entre no link:</h2>
                                                    <a href={`${process.env.NEXT_PUBLIC_SITE_URL}/quiz?code=${code}`} target='_blank'>
                                                        <h2>{process.env.NEXT_PUBLIC_SITE_DOMAIN}/quiz?code={code}</h2>
                                                    </a>
                                                </div>
                                                <a href={`${process.env.NEXT_PUBLIC_SITE_URL}/controller?code=${code}`} target='_blank'>
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
                                        {quiz &&
                                            <PlayersList
                                                players={room.players}
                                                totalQuestions={quiz.questions.length}
                                            />
                                        }
                                    </section>
                                }
                                {session.user.id !== room.owner.id &&
                                    <div>
                                        <h3>Esta é a visão de quem não é dono da sala</h3>
                                    </div>
                                }
                            </div>
                        }
                    </main>
                </div>
            }
        </div>
    )
})