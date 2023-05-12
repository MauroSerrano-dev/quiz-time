import styles from '../styles/quiz.module.css'
import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import io from "socket.io-client";
import { motion } from "framer-motion"

let socket;

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

    useEffect(() => {
        if (session && !room) {
            getQuiz()
            getRoom()
            socketInitializer()
        }
    }, [session])

    useEffect(() => {
        if (room && joined) {
            updateOptionSelected()
        }
        if (room && room.state === 'finish') {
            setResults(getResults())
            setAllResults(getAllResults())
        }
    }, [room])

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
                if (startRoom.players.filter(player => player.email === session.user.email)[0].answers.some(answer => answer.questionIndex === startRoom.currentQuestion))
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
                }, 250)
            }
            else
                setRoom(prev => { return { ...prev, ...roomAttFields } })
        })
    }

    function updateOptionSelected() {
        if (room.players.filter(player => player.email === session.user.email)[0]?.answers.some(answer => answer.questionIndex === room.currentQuestion))
            setOptionSelected(room.players.filter(player => player.email === session.user.email)[0].answers.filter(answer => answer.questionIndex === room.currentQuestion)[0].optionIndex)
        else
            setOptionSelected()
    }

    function answer(option) {
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
                })
        }
    }

    function joinQuiz() {
        setJoined(true)
        socket.emit("updateRoom", { ...room, players: [...room.players, { email: session.user.email, name: session.user.name, answers: [] }] });
    }

    function leaveQuiz() {
        setJoined(false)
        socket.emit("updateRoom", { ...room, players: room.players.filter(player => player.email !== session.user.email) });
    }

    function getResults() {
        return quiz.results.map(result => {
            return {
                ...result, points: room.players.filter(player => player.email === session.user.email)[0]?.answers
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
                ...result, points: room.players.filter(player => player.email === session.user.email)[0]?.answers
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
                {room && room.state === 'active' && quiz && joined &&
                    <motion.div className={styles.questionOptions}
                        initial={{ opacity: 0 }}
                        animate={questionTransition ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.2, ease: [.62, -0.18, .32, 1.17] }}
                    >
                        <div className={styles.questionContainer}>
                            <h2>{room.currentQuestion + 1}. {quiz.questions[room.currentQuestion].content}</h2>
                        </div>
                        <div className={styles.optionsContainer}>
                            <button className={`${styles.option} ${optionSelected === 0 ? styles.optionSelected : ''}`} onClick={() => answer(0)}><p>{quiz.questions[room.currentQuestion].options[0].content}</p></button>
                            <button className={`${styles.option} ${optionSelected === 1 ? styles.optionSelected : ''}`} onClick={() => answer(1)}><p>{quiz.questions[room.currentQuestion].options[1].content}</p></button>
                            <button className={`${styles.option} ${optionSelected === 2 ? styles.optionSelected : ''}`} onClick={() => answer(2)}><p>{quiz.questions[room.currentQuestion].options[2].content}</p></button>
                            <button className={`${styles.option} ${optionSelected === 3 ? styles.optionSelected : ''}`} onClick={() => answer(3)}><p>{quiz.questions[room.currentQuestion].options[3].content}</p></button>
                        </div>
                    </motion.div>
                }
                {room && quiz && room.state === 'finish' && joined &&
                    <div>
                        <h2>Finalizado</h2>
                    </div>
                }
                {room && quiz && room.state === 'results' && results && joined &&
                    <div>
                        <h2>Resultado</h2>
                        <div>
                            {results.map((result, i) =>
                                <div key={`Result: ${i}`}>
                                    <img style={{ borderRadius: '0.5rem' }} src={result.img} />
                                    <p>{result.name} {result.points}</p>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </main>
        </motion.div>
    )
})