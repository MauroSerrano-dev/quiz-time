import { withRouter } from 'next/router'
import styles from '../styles/controller.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import { Button, ButtonGroup } from '@mui/material';
import NoSessionPage from '@/components/NoSessionPage';
import { getStandardQuiz, getUserQuiz } from '../../utils/api-caller';

let socket;

export default withRouter((props) => {
    const { session, signIn } = props
    const [room, setRoom] = useState()
    const [state, setState] = useState('none')
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
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
            setRoom(room)
            setDisableShow(room.state === 'disable')
            setActiveShow(room.state === 'active')
        })

        socket.on(`updateFieldsRoom${code}`, (att) => {
            const { roomAtt } = att
            setDisableShow(roomAtt.state === 'disable')
            setActiveShow(roomAtt.state === 'active')
            setRoom(roomAtt)
        })

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

    function startQuiz() {
        setDisableShow(false)
        setActiveShow(true)
        setTimeout(() => {
            socket.emit("updateRoom", { ...room, state: 'active' })
        }, 600)
    }

    function switchControl(isControl) {
        socket.emit("updateRoom", { ...room, control: isControl })
    }

    function changeState(newState) {
        setState(newState)
    }

    return (
        <div className='flex size100'>
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <div id={styles.container}>
                    <div className='flex size100'>
                        {room && Object.keys(room).length === 0 &&
                            <div>
                                <h2 id={styles.roomName}>Esta sala não existe</h2>
                            </div>
                        }
                        {room && Object.keys(room).length > 0 &&
                            <div id={styles.controllerContainer}>
                                <h2 id={styles.roomName}>Controle da Sala {room.name}</h2>
                                {session.user.email === room.owner &&
                                    <div id={styles.ownerView}>
                                        {state === 'none' &&
                                            <div id={styles.menu}>
                                                <Button onClick={() => changeState('quiz')} variant="outlined" sx={{ width: '100%', height: '160px' }}>Jogar um Quiz</Button>
                                                <Button variant="outlined" sx={{ width: '100%', height: '160px' }}>Fazer Enquete</Button>
                                                <Button variant="outlined" sx={{ width: '100%', height: '160px' }}>Modo Q&A</Button>
                                                <Button variant="outlined" sx={{ width: '100%', height: '160px' }}>QR Code</Button>
                                            </div>
                                        }
                                        {state === 'quiz' &&
                                            <div id={styles.quizMenu}>

                                            </div>
                                        }
                                        {/* <div id={styles.playersList}>
                                            <h3>Players</h3>
                                            {room.players.map((player, i) =>
                                                <p key={`Player: ${i}`}>{player.user.name} {player.answers.some((answer) => answer.questionIndex === room.currentQuestion) ? 'check' : ''}</p>
                                            )}
                                        </div> */}
                                    </div>
                                }
                                {session.user.email !== room.owner &&
                                    <div>
                                        <h3>Esta é a visão de quem não é dono da sala</h3>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
})