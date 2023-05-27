import styles from '../styles/quiz.module.css'
import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import io from "socket.io-client"
import { motion } from "framer-motion"
import { Button, Box, Grid, TextField } from '@mui/material';
import { getLayout } from '../../utils/layout'
import { showErrorToast } from '../../utils/toasts'

let socket

const TRANSITION_DURATION = 200

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.5,
            delayChildren: 0.8,
            staggerChildren: 0.25,
        }
    }
}

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
}

export default withRouter((props) => {
    const { session } = props
    const { code } = props.router.query

    const [quiz, setQuiz] = useState()
    const [room, setRoom] = useState()
    const [dots, setDots] = useState('')
    const [joined, setJoined] = useState(false)
    const [optionSelected, setOptionSelected] = useState()
    const [results, setResults] = useState([])
    const [allResults, setAllResults] = useState([])
    const [allSubResults, setAllSubResults] = useState([])
    const [questionTransition, setQuestionTransition] = useState(false)
    const [disableOptions, setDisableOptions] = useState(false)
    const [layout, setLayout] = useState([])
    const [locked, setLocked] = useState(false)
    const [unlockCode, setUnlockCode] = useState('')

    useEffect(() => {
        if (!room) {
            socketInitializer()
        }
        if (room && !quiz) {
            getQuiz()
        }
    }, [room])

    useEffect(() => {
        if (room && joined && room.control) {
            updateOptionSelected()
        }
        if (room && quiz && (room.state === 'finish' || room.state === 'results' || getPlayer()?.state === 'result')) {
            const myResults = getResults()
            const myAllResults = getAllResults()
            const myAllSubResults = getAllSubResults()
            const chartRadarIndex = quiz.layout.findIndex(item => item.name === 'ChartRadar')
            const myRadarData = chartRadarIndex !== -1 ? getRadarData(quiz.layout[chartRadarIndex].radarOrder, myAllResults, myAllSubResults) : []
            setResults(myResults)
            setAllResults(myAllResults)
            setAllSubResults(myAllSubResults)
            setLayout(getLayout(quiz.layout, myResults, myAllResults, myRadarData))
        }
    }, [room, quiz])

    useEffect(() => {
        if (room && room.private && !joined && session.user.email !== room.owner)
            lockRoom()
    }, [room])

    useEffect(() => {
        setTimeout(() => setDots(prev => prev.length >= 3 ? '' : prev + '.'), 500)
    }, [dots])

    async function getQuiz() {
        const options = {
            method: 'GET',
            headers: { "quizname": room.quizInfo.name },
        };

        await fetch('/api/quizzesStandard', options)
            .then(response => response.json())
            .then(response => setQuiz(response.quiz))
            .catch(err => console.error(err))
    }

    const socketInitializer = async () => {
        const options = { method: 'GET' }
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } });

        socket.on("getData", (startRoom) => {
            if (startRoom.players.some(player => player.email === session.user.email)) {
                setJoined(true)
                if (startRoom.players.filter(player => player.email === session.user.email)[0].answers.some(answer => answer.questionIndex === startRoom.currentQuestion) && startRoom.control)
                    setOptionSelected(startRoom.players.filter(player => player.email === session.user.email)[0].answers.filter(answer => answer.questionIndex === startRoom.currentQuestion)[0].optionIndex)
            }
            setRoom(startRoom)
        });

        socket.on("updateFields", (roomAttFields) => {
            if (roomAttFields.state === 'active') {
                setTimeout(() =>
                    setQuestionTransition(false)
                    , TRANSITION_DURATION)
            }
            const firstKey = Object.keys(roomAttFields)[0]
            if (roomAttFields.players && roomAttFields.players.every(player => player.email !== session.user.email))
                setJoined(false)
            if (roomAttFields.currentQuestion !== undefined) {
                setQuestionTransition(true)
                setTimeout(() => {
                    setRoom(prev => { return { ...prev, ...roomAttFields } })
                    setQuestionTransition(false)
                }, TRANSITION_DURATION)
            }
            else if (firstKey.includes('players') && firstKey !== 'players') {
                setRoom(prev => { return { ...prev, players: prev.players.filter(player => player.email !== roomAttFields[firstKey].email).concat(roomAttFields[firstKey]) } })
                turnOffTransition()
            }
            else {
                setRoom(prev => { return { ...prev, ...roomAttFields } })
            }
        })
    }

    function updateOptionSelected() {
        if (getPlayer()?.answers.some(answer => answer.questionIndex === room.currentQuestion))
            setOptionSelected(getPlayer().answers.filter(answer => answer.questionIndex === room.currentQuestion)[0].optionIndex)
        else
            setOptionSelected()
    }

    function answerControl(option) {
        const player = getPlayer()
        if (optionSelected === option) {
            setOptionSelected()
            socket.emit("updateAnswer",
                {
                    ...player,
                    answers: player.answers.filter(answer => answer.questionIndex !== room.currentQuestion)
                }, code
            )
        }
        else {
            setOptionSelected(option)
            socket.emit("updateAnswer",
                {
                    ...player,
                    answers: player.answers.filter(answer => answer.questionIndex !== room.currentQuestion).concat([{ ...quiz.questions[room.currentQuestion].options[option], questionIndex: room.currentQuestion, optionIndex: option }])
                }
            )
        }
    }

    function answer(option) {
        setOptionSelected(option)
        setDisableOptions(true)
        const showResult = getPlayer().currentQuestion >= quiz.questions.length - 1

        setTimeout(() => {
            setQuestionTransition(true)
            setOptionSelected()
        }, TRANSITION_DURATION + 400)

        setTimeout(() => {
            const player = getPlayer()
            socket.emit("updateAnswer",
                {
                    ...player,
                    currentQuestion: showResult ? player.currentQuestion : player.currentQuestion + 1,
                    state: showResult ? 'result' : player.state,
                    answers: [...player.answers, { ...quiz.questions[player.currentQuestion].options[option], questionIndex: player.currentQuestion, optionIndex: option }]
                }, code
            )
        }, TRANSITION_DURATION * 2.1 + 400)
    }

    function turnOffTransition() {
        setTimeout(() => {
            setDisableOptions(false)
            setQuestionTransition(false)
        }, TRANSITION_DURATION)
    }

    function joinQuiz() {
        setJoined(true)
        socket.emit("updateRoom", { ...room, players: [...room.players, { email: session.user.email, name: session.user.name, answers: [], currentQuestion: 0, state: 'answering' }] });
    }

    function leaveQuiz() {
        if (room.private)
            lockRoom()
        setJoined(false)
        socket.emit("updateRoom", { ...room, players: room.players.filter(player => player.email !== session.user.email) });
    }

    function lockRoom() {
        setLocked(true)
    }

    function unlockRoom() {
        setLocked(false)
    }

    function getResults() {
        return quiz.results.map(result => {
            return {
                ...result, points: getPlayer()?.answers
                    .reduce((acc, answer) =>
                        acc + answer.actions.reduce((accumulator, action) =>
                            action.profile === result.name
                                ? accumulator + action.points
                                : accumulator
                            , 0)
                        , 0)
            }
        }).sort((a, b) => b.points - a.points).reduce((acc, result) => acc.length === 0 || acc[0].points === result.points ? [...acc, result] : acc, [])
    }

    function getAllResults() {
        return quiz.results.map(result => {
            return {
                ...result, points: getPlayer()?.answers
                    .reduce((acc, answer) =>
                        acc + answer.actions.reduce((accumulator, action) =>
                            action.profile === result.name
                                ? accumulator + action.points
                                : accumulator
                            , 0)
                        , 0)
            }
        }).sort((a, b) => b.points - a.points)
    }

    function getAllSubResults() {
        return quiz.subResults.map(result => {
            return {
                ...result, points: getPlayer()?.answers
                    .reduce((acc, answer) =>
                        acc + answer.actions.reduce((accumulator, action) =>
                            action.profile === result.name
                                ? accumulator + action.points
                                : accumulator
                            , 0)
                        , 0)
            }
        }).sort((a, b) => b.points - a.points)
    }

    function getPlayer() {
        return room.players.filter(player => player.email === session.user.email)[0]
    }

    function getRadarData(order, allResults, allSubResults) {
        return order.map(name => allResults.concat(allSubResults).find(e => e.name === name))
    }

    function handleUnlockChange(event) {
        setUnlockCode(event.target.value)
    }

    function handleSubmitUnlock(event) {
        if (event._reactName === 'onClick' || event.key === 'Enter') {
            if (unlockCode === room.password) {
                joinQuiz()
                unlockRoom()
                setUnlockCode('')
            }
            else {
                showErrorToast("Senha incorreta.", 3000)
            }
        }
    }

    return (
        <motion.div id={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [.62, -0.18, .32, 1.17] }}
        >
            <main>
                {room &&
                    <div>
                        <h3 id={styles.roomName}>{room.quizInfo.name}</h3>
                        {room.state === 'disable' &&
                            <div>
                                {!joined &&
                                    <div>
                                        {locked &&
                                            <div>
                                                <h3>Insira a Senha</h3>
                                                <TextField
                                                    value={unlockCode}
                                                    onChange={handleUnlockChange}
                                                    onKeyDown={handleSubmitUnlock}
                                                    id="outlined-basic"
                                                    label="Senha"
                                                    variant='outlined'
                                                    autoComplete='off'
                                                />
                                            </div>
                                        }
                                        <Button variant="outlined" onClick={locked ? handleSubmitUnlock : joinQuiz}>Entrar</Button>
                                    </div>
                                }
                                {joined &&
                                    <div>
                                        <div id={styles.watingContainer}>
                                            <h3 id={styles.watingMsg}>Aguarde enquanto o Quiz começa{dots}</h3>
                                        </div>
                                        <Button variant="outlined" onClick={leaveQuiz}>Sair</Button>
                                    </div>
                                }
                            </div>
                        }
                        {room.state === 'active' && quiz && joined && getPlayer().state === 'answering' &&
                            <div id={styles.questionOptions}>
                                <motion.div
                                    id={styles.questionContainer}
                                    initial={{ opacity: 0 }}
                                    animate={questionTransition ? { opacity: 0 } : { opacity: 1 }}
                                    transition={{ duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                                >
                                    <h2>{room.control ? room.currentQuestion + 1 : getPlayer().currentQuestion + 1}. {quiz.questions[room.control ? room.currentQuestion : getPlayer().currentQuestion].content}</h2>
                                </motion.div>
                                <motion.div
                                    id={styles.optionsContainer}
                                    variants={container}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {quiz.questions[room.control ? room.currentQuestion : getPlayer().currentQuestion].options.map((option, i) =>
                                        <motion.div key={`Option: ${i}`} variants={item}>
                                            <Button
                                                variant={optionSelected === i ? 'contained' : 'outlined'}
                                                key={`Option: ${i}`}
                                                className={styles.option}
                                                onClick={() => room.control ? answerControl(i) : answer(i)}
                                                sx={{
                                                    pointerEvents: disableOptions ? 'none' : 'auto',
                                                    width: '350px',
                                                    height: '50px',
                                                    '&:hover': {
                                                        border: '1px solid rgba(0, 159, 218, 0.5)',
                                                        backgroundColor: optionSelected === i ? '' : 'transparent',
                                                    }
                                                }}
                                            >
                                                <motion.p
                                                    initial={{ opacity: 0, color: 'var(--text-white)' }}
                                                    animate={questionTransition ? { opacity: 0 } : { opacity: 1 }}
                                                    transition={{ duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                                                >
                                                    {option.content}
                                                </motion.p>
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        }
                        {quiz && room.state === 'finish' && joined &&
                            <div>
                                <h2>Finalizado</h2>
                            </div>
                        }
                        {quiz && (room.state === 'results' || getPlayer()?.state === 'result') && results && joined &&
                            <motion.div

                                id={styles.resultContainer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: TRANSITION_DURATION / 2000, duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                            >
                                {layout.map((item, i) => <Box id={styles.resultBlock} key={i}>{item.value}</Box>)}
                            </motion.div>
                        }
                    </div>
                }
            </main>
        </motion.div>
    )
})