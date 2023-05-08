import styles from '../styles/quiz.module.css'
import { useEffect, useState } from 'react'
import { withRouter } from 'next/router'
import io from "socket.io-client";

let socket;

export default withRouter((props) => {
    const { code } = props.router.query

    /* const { quizName } = props */
    const quizName = 'Perfil Comportamental'
    const [quiz, setQuiz] = useState()
    const [dots, setDots] = useState('')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [state, setState] = useState('active')

    useEffect(() => {
        getQuiz()
        socketInitializer()
    }, [])

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

    const socketInitializer = async () => {
        const options = {
            method: 'GET',
            headers: { email: 'mauro.r.serrano.f@gmail.com' },
        };
        await fetch("/api/socket", options)

        socket = io();

        socket.on("getData", (data) => {
            setCurrentQuestion(data.currentQuestion)
        });

        socket.on("updateFields", (roomAttFields) => {
            setCurrentQuestion(roomAttFields.currentQuestion)})
    }

    function nextQuestion() {
        if (currentQuestion >= quiz.questions.length - 1)
            setState('finish')
        else
            setCurrentQuestion(prev => prev + 1)
    }

    return (
        <div>
            <main>
                <h1 className={styles.roomName}>{quizName}</h1>
                {state === 'disable' &&
                    <div className={styles.watingContainer}>
                        <h3 className={styles.watingMsg}>Aguarde enquanto o Quiz começa</h3><h3 className={styles.dots}>{dots}</h3>
                    </div>
                }
                {state === 'active' && quiz &&
                    <div>
                        <div className={styles.questionContainer}>
                            <h2>{quiz.questions[currentQuestion].content}</h2>
                        </div>
                        <div className={styles.optionsContainer}>
                            <button onClick={nextQuestion}>{quiz.questions[currentQuestion].options[0].content}</button>
                            <button onClick={nextQuestion}>{quiz.questions[currentQuestion].options[1].content}</button>
                            <button onClick={nextQuestion}>{quiz.questions[currentQuestion].options[2].content}</button>
                            <button onClick={nextQuestion}>{quiz.questions[currentQuestion].options[3].content}</button>
                        </div>
                    </div>
                }
                {state === 'finish' &&
                    <div>
                        <h2>Finalizado</h2>
                    </div>
                }
            </main>
        </div>
    )
})