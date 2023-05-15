import styles from '../styles/quiz.module.css'
import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import io from "socket.io-client";
import { motion } from "framer-motion"
import ChartPie from '../components/ChartPie';

let socket;

const TRANSITION_DURATION = 250

export default withRouter((props) => {
    const { session } = props
    const { code } = props.router.query

    /* const { quizName } = props */
    const quizName = 'Perfil Comportamental'
    const [quiz, setQuiz] = useState()
    const [room, setRoom] = useState()
    const [dots, setDots] = useState('')
    const [joined, setJoined] = useState(false)
    const [optionSelected, setOptionSelected] = useState()
    const [results, setResults] = useState([])
    const [allResults, setAllResults] = useState([])
    const [questionTransition, setQuestionTransition] = useState(false)
    const [disableOptions, setDisableOptions] = useState(false)

    useEffect(() => {
        if (session && !room) {
            getQuiz()
            getRoom()
            socketInitializer()
        }
    }, [session])

    useEffect(() => {
        if (room && joined && room.control) {
            updateOptionSelected()
        }
        if (room && quiz && (room.state === 'finish' || room.state === 'results' || getPlayer()?.state === 'result')) {
            setResults(getResults())
            setAllResults(getAllResults())
        }
    }, [room, quiz])

    useEffect(() => {
        setTimeout(() => setDots(prev => prev.length >= 3 ? '' : prev + '.'), 500)
    }, [dots])

    async function getQuiz() {
        const options = {
            method: 'GET',
            headers: { "quizname": quizName },
        };

        await fetch('/api/quizzesStandard', options)
            .then(response => response.json())
            .then(response => setQuiz(response.quiz))
            .catch(err => console.error(err))
    }

    async function getRoom() {
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
            if (roomAttFields.players && roomAttFields.players.every(player => player.email !== session.user.email))
                setJoined(false)
            if (roomAttFields.currentQuestion !== undefined) {
                setQuestionTransition(true)
                setTimeout(() => {
                    setRoom(prev => { return { ...prev, ...roomAttFields } })
                    setQuestionTransition(false)
                }, TRANSITION_DURATION)
            }
            else if (Object.keys(roomAttFields).some(field => field.includes('players'))) {
                const key = Object.keys(roomAttFields)[0]
                setRoom(prev => { return { ...prev, players: prev.players.filter(player => player.email !== roomAttFields[key].email).concat(roomAttFields[key]) } })
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
        if (optionSelected === option) {
            setOptionSelected()
            socket.emit("updateRoom",
                {
                    ...room, players: room.players.map(player =>
                        player.email === session.user.email
                            ? {
                                ...player,
                                answers: player.answers.filter(answer => answer.questionIndex !== room.currentQuestion)
                            }
                            : player
                    )
                })
        }
        else {
            setOptionSelected(option)
            socket.emit("updateRoom",
                {
                    ...room, players: room.players.map(player =>
                        player.email === session.user.email
                            ? {
                                ...player,
                                answers: player.answers.filter(answer => answer.questionIndex !== room.currentQuestion).concat([{ ...quiz.questions[room.currentQuestion].options[option], questionIndex: room.currentQuestion, optionIndex: option }])
                            }
                            : player
                    )
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
            setTimeout(() => {
                /* socket.emit("updateAnswer",
                    {
                        ...room, players: room.players.map(player =>
                            player.email === session.user.email
                                ? {
                                    ...player,
                                    currentQuestion: showResult ? player.currentQuestion : player.currentQuestion + 1,
                                    state: showResult ? 'result' : player.state,
                                    answers: [...player.answers, { ...quiz.questions[player.currentQuestion].options[option], questionIndex: player.currentQuestion, optionIndex: option }]
                                }
                                : player
                        )
                    }
                ) */
                const player = getPlayer()
                socket.emit("updateAnswer",
                    {
                        ...player,
                        currentQuestion: showResult ? player.currentQuestion : player.currentQuestion + 1,
                        state: showResult ? 'result' : player.state,
                        answers: [...player.answers, { ...quiz.questions[player.currentQuestion].options[option], questionIndex: player.currentQuestion, optionIndex: option }]
                    }, code
                )
                setOptionSelected()
                setDisableOptions(false)
                if (!showResult) {
                    setQuestionTransition(false)
                }
            }, TRANSITION_DURATION)
        }, TRANSITION_DURATION)
    }

    function joinQuiz() {
        setJoined(true)
        socket.emit("updateRoom", { ...room, players: [...room.players, { email: session.user.email, name: session.user.name, answers: [], currentQuestion: 0, state: 'answering' }] });
    }

    function leaveQuiz() {
        setJoined(false)
        socket.emit("updateRoom", { ...room, players: room.players.filter(player => player.email !== session.user.email) });
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
        console.log(quiz.results)
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

    function getPlayer() {
        return room.players.filter(player => player.email === session.user.email)[0]
    }

    return (
        <motion.div className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [.62, -0.18, .32, 1.17] }}
        >
            <main>
                <h3 className={styles.roomName}>{quizName}</h3>
                {room && room.state === 'disable' &&
                    <div>
                        {!joined &&
                            <button onClick={joinQuiz}>Join</button>
                        }
                        {joined &&
                            <div>
                                <div className={styles.watingContainer}>
                                    <h3 className={styles.watingMsg}>Aguarde enquanto o Quiz começa{dots}</h3>
                                </div>
                                <button onClick={leaveQuiz}>Leave</button>
                            </div>
                        }
                    </div>
                }
                {room && room.state === 'active' && quiz && joined && getPlayer().state === 'answering' &&
                    <motion.div className={styles.questionOptions}
                        initial={{ opacity: 0 }}
                        animate={questionTransition ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                    >
                        <div className={styles.questionContainer}>
                            <h2>{room.control ? room.currentQuestion + 1 : getPlayer().currentQuestion + 1}. {quiz.questions[room.control ? room.currentQuestion : getPlayer().currentQuestion].content}</h2>
                        </div>
                        <div className={styles.optionsContainer}>
                            {quiz.questions[room.control ? room.currentQuestion : getPlayer().currentQuestion].options.map((option, i) =>
                                <button key={`Option: ${i}`} className={`${styles.option} ${optionSelected === i ? styles.optionSelected : ''}`} onClick={() => room.control ? answerControl(i) : answer(i)} disabled={disableOptions} ><p>{option.content}</p></button>)
                            }
                        </div>
                    </motion.div>
                }
                {room && quiz && room.state === 'finish' && joined &&
                    <div>
                        <h2>Finalizado</h2>
                    </div>
                }
                {room && quiz && (room.state === 'results' || getPlayer()?.state === 'result') && results && joined &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: TRANSITION_DURATION / 2000, duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                    >
                        <div>
                            {results.map((result, i) =>
                                <div key={`Result: ${i}`}>
                                    <img style={{ borderRadius: '0.5rem' }} src={result.img} />
                                    <h2>{result.name}</h2>
                                </div>
                            )}
                        </div>
                        <div style={{ width: '320px', height: '200px', marginTop: '2rem' }}>
                            <ChartPie data={allResults} totalPoints={allResults.reduce((acc, result) => acc + result.points, 0)} />
                        </div>
                    </motion.div>
                }
            </main>
        </motion.div>
    )
})