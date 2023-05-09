import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import $ from 'jquery'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"

let socket;

export default withRouter((props) => {
    const [room, setRoom] = useState();
    const [size, setSize] = useState()
    const { data: session } = useSession()

    useEffect(() => {
        const newSize = $(`.${styles.qrContainer}`).css("width")
        setSize(Number(newSize.slice(0, newSize.length - 2)) * 0.7)
    }, [])

    const { code } = props.router.query

    useEffect(() => {
        if (session) {
            socketInitializer();
        }
    }, [session]);

    const socketInitializer = async () => {
        const options = {
            method: 'GET',
            headers: { email: session.user.email },
        };
        await fetch("/api/socket", options)

        socket = io();

        socket.on("getData", (data) => {
            setRoom(data)
        });

        socket.on("updateFields", (roomAttFields) => {
            setRoom(prev => { return { ...prev, ...roomAttFields } })
        });
    };

    const nextQuestion = async () => {
        socket.emit("updateRoom", { ...room, currentQuestion: room.currentQuestion + 1 });
    };
    const resetQuestions = async () => {
        socket.emit("updateRoom", { ...room, currentQuestion: 0 });
    };
    const startQuiz = async () => {
        socket.emit("updateRoom", { ...room, state: 'active' });
    };
    const disableQuiz = async () => {
        socket.emit("updateRoom", { ...room, state: 'disable' });
    };

    return (
        <div>
            <main>
                <h1 className={styles.roomName}>Essa é a sala: {code}</h1>
                <div className={styles.qrContainer}>
                    {size && <div className={styles.qrCode}><QRCode value={`quiz-maker.herokuapp.com/quiz?code=${code}`} size={size} ecLevel='H' qrStyle='dots' logoImage='quiz-time-logo.png' logoWidth={size * 0.6} logoOpacity={0.5} eyeColor={{ outer: '#00a0dc', inner: '#005270' }} eyeRadius={5} /></div>}
                    <h2>Scan Me!</h2>
                    <div className={styles.frame}></div>
                    <div className={`${styles.frame} ${styles.border}`}></div>
                    <div className={styles.textContainer}></div>
                </div>
                <button onClick={nextQuestion}>Next Question</button>
                <button onClick={resetQuestions}>Reset Questions</button>
                <button onClick={startQuiz}>Start Quiz</button>
                <button onClick={disableQuiz}>Disable Quiz</button>
            </main>
        </div>
    );
})