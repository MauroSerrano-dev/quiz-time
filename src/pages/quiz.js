import styles from '../styles/quiz.module.css'
import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import io from "socket.io-client";
import { useSession, signIn, signOut } from "next-auth/react"

let socket;

export default withRouter((props) => {
    const { data: session } = useSession()
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

    useEffect(() => {
        if (session && !room) {
            getQuiz()
            getRoom()
            socketInitializer()
        }
    }, [session])

    useEffect(() => {
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

        fetch('/api/quizzesStandard', options)
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

        socket.on("getData", (data) => {
            if (data.players.some(player => player.email === session.user.email))
                setJoined(true)
            setRoom(data)
        });

        socket.on("updateFields", (roomAttFields) => {
            if (roomAttFields.currentQuestion)
                setOptionSelected()
            setRoom(prev => { return { ...prev, ...roomAttFields } })
        })
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
                                answers: player.answers.filter((answer, i) => i !== room.currentQuestion)
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
                                answers: [
                                    ...player.answers.slice(0, room.currentQuestion),
                                    quiz.questions[room.currentQuestion].options[option],
                                    ...player.answers.slice(room.currentQuestion + 1, player.answers.length)
                                ]
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
                ...result, points: room.players.filter(player => player.email === session.user.email)[0].answers
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
                ...result, points: room.players.filter(player => player.email === session.user.email)[0].answers
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
        <div>
            <main>
                <h1 className={styles.roomName}>{quizName}</h1>
                {room && room.state === 'disable' &&
                    <div>
                        {!joined &&
                            <button onClick={joinQuiz}>Join</button>
                        }
                        {joined &&
                            <div>
                                <div className={styles.watingContainer}>
                                    <h3 className={styles.watingMsg}>Aguarde enquanto o Quiz começa</h3><h3 className={styles.dots}>{dots}</h3>
                                </div>
                                <button onClick={leaveQuiz}>Leave</button>
                            </div>
                        }
                    </div>
                }
                {room && room.state === 'active' && quiz &&
                    <div>
                        <div className={styles.questionContainer}>
                            <h2>{quiz.questions[room.currentQuestion].content}</h2>
                        </div>
                        <div className={styles.optionsContainer}>
                            <button className={optionSelected === 0 ? styles.optionSelected : ''} onClick={() => answer(0)}>{quiz.questions[room.currentQuestion].options[0].content}</button>
                            <button className={optionSelected === 1 ? styles.optionSelected : ''} onClick={() => answer(1)}>{quiz.questions[room.currentQuestion].options[1].content}</button>
                            <button className={optionSelected === 2 ? styles.optionSelected : ''} onClick={() => answer(2)}>{quiz.questions[room.currentQuestion].options[2].content}</button>
                            <button className={optionSelected === 3 ? styles.optionSelected : ''} onClick={() => answer(3)}>{quiz.questions[room.currentQuestion].options[3].content}</button>
                        </div>
                    </div>
                }
                {room && quiz && room.state === 'finish' && results &&
                    <div>
                        <h2>Finalizado</h2>
                        <div>
                            {results.map((result, i) =>
                                <div key={`Result: ${i}`}>
                                    <img src={result.img} />
                                    <p>{result.name} {result.points}</p>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </main>
        </div>
    )
})