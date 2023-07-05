import styles from '../styles/quiz.module.css'
import { useEffect, useRef, useState } from 'react'
import { withRouter } from 'next/router'
import io from "socket.io-client"
import { motion } from "framer-motion"
import { Button, TextField } from '@mui/material';
import { getLayout } from '../../utils/layout'
import { showErrorToast } from '../../utils/toasts'
import NoSessionPage from '@/components/NoSessionPage'
import OptionInput from '@/components/OptionInput'
import { getImage, getStandardQuiz, getUserQuiz } from '../../utils/api-caller'

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
    const { session, signIn } = props
    const { code } = props.router.query

    const [room, setRoom] = useState()
    const [quiz, setQuiz] = useState()
    const [dots, setDots] = useState('')
    const [joined, setJoined] = useState(false)
    const [optionSelected, setOptionSelected] = useState()
    const [allResults, setAllResults] = useState([])
    const [allSubResults, setAllSubResults] = useState([])
    const [questionTransition, setQuestionTransition] = useState(false)
    const [disableOptions, setDisableOptions] = useState(false)
    const [layout, setLayout] = useState([])
    const [locked, setLocked] = useState(false)
    const [unlockCode, setUnlockCode] = useState('')
    const [isMobile, setIsMobile] = useState(false)

    const getPlayerResultsRef = useRef(getPlayerResults);
    const roomRef = useRef(room);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                navigator.msMaxTouchPoints > 0
            )
        }
        checkIsMobile()

        window.addEventListener('resize', checkIsMobile)

        return () => {
            window.removeEventListener('resize', checkIsMobile)
        }
    }, [])

    useEffect(() => {
        if (!room && code && session) {
            async function socketInitializer() {
                const options = {
                    method: 'GET'
                }
                await fetch("/api/socket", options)
                socket = io({ query: { code: code } })

                socket.emit('getRoom', code)

                socket.on(`sendRoom${code}`, (startRoom) => {
                    if (startRoom) {
                        if (startRoom.players && Object.keys(startRoom.players).some(playerId => playerId === session.user.id)) {
                            setJoined(true)
                            if (Object.keys(
                                startRoom.players[session.user.id].answers === undefined
                                    ? {}
                                    : startRoom.players[session.user.id].answers
                            )
                                .some(answer => answer.questionIndex === startRoom.currentQuestion) && startRoom.control
                            )
                                setOptionSelected(startRoom.players[session.user.id].answers[startRoom.currentQuestion].optionIndex)
                        }
                        setRoom(startRoom)
                    }
                    socket.on(`saveResults${code}`, async () => {
                        const newPlayer = await getPlayerResultsRef.current()
                        socket.emit("updatePlayer", newPlayer, code)
                    })
                    socket.on(`updateFieldsRoom${code}`, (att) => {
                        const { roomAtt } = att
                        if (roomAtt.state !== roomRef.current.state) {
                            setTimeout(() =>
                                setQuestionTransition(false),
                                TRANSITION_DURATION
                            )
                        }
                        if (roomAtt.players && roomAtt.players[session.user.id] !== undefined)
                            setJoined(true)
                        else
                            setJoined(false)
                        if (false/* roomAtt.control */) {
                            setQuestionTransition(true)
                            setTimeout(() => {
                                setRoom(roomAtt)
                                setQuestionTransition(false)
                            }, TRANSITION_DURATION)
                        }
                        else {
                            turnOffTransition()
                            setRoom(roomAtt)
                        }
                    })
                })
            }

            socketInitializer()
        }
    }, [session, code])

    useEffect(() => {
        getPlayerResultsRef.current = getPlayerResults
        roomRef.current = room
    }, [room])

    useEffect(() => {
        if (room && room.quizInfo.id !== '' && !quiz) {
            async function getQuiz() {
                let quizResponse
                if (room.quizInfo.type === 'standard')
                    quizResponse = await getStandardQuiz(room.quizInfo.id)
                else
                    quizResponse = await getUserQuiz(room.quizInfo.creator.id, room.quizInfo.id)

                try {
                    const response = await quizResponse.json()
                    const updatedQuiz = {
                        ...response.quiz,
                        questions: await Promise.all(response.quiz.questions.map(async (question) => {
                            const img = question.img && question.img.id
                                ? await getImage(room.quizInfo.creator.uui, question.img.id)
                                : null
                            const options = await Promise.all(question.options.map(async (option) => {
                                const optionImg = option.img && option.img.id
                                    ? await getImage(room.quizInfo.creator.uui, option.img.id)
                                    : null
                                return { ...option, img: optionImg }
                            }));
                            return { ...question, img: img, options: options }
                        })),
                        results: await Promise.all(response.quiz.results.map(async (result) => {
                            const img = result.img.id
                                ? await getImage(room.quizInfo.creator.uui, result.img.id)
                                : null
                            return { ...result, img: img };
                        })),
                    }

                    setQuiz(updatedQuiz)
                } catch (err) {
                    console.error(err)
                }
            }
            getQuiz()
        }
    }, [room])

    useEffect(() => {
        if (room && joined && room.control) {
            updateOptionSelected()
        }
        if (room && quiz && getPlayer() && getPlayer().results && (room.state === 'finish' || room.state === 'results' || getPlayer().state === 'result')) {
            const myAllResults = getAllResults()
            const myAllSubResults = getAllSubResults()
            const chartRadarIndex = quiz.layout.findIndex(item => item.name === 'ChartRadar')
            const myRadarData = chartRadarIndex !== -1
                ? getRadarData(quiz.layout[chartRadarIndex].radarOrder, myAllResults, myAllSubResults)
                : []
            setAllResults(myAllResults)
            setAllSubResults(myAllSubResults)
            setLayout(getLayout(quiz.layout, getPlayer().results, myAllResults, myRadarData, quiz.results))
        }
    }, [room, quiz])

    useEffect(() => {
        if (room && room.private && !joined && session.user.email !== room.owner.email)
            lockRoom()
    }, [room])

    useEffect(() => {
        setTimeout(() => setDots(prev => prev.length >= 3 ? '' : prev + '.'), 500)
    }, [dots])

    function updateOptionSelected() {
        if (
            getPlayer() !== null &&
            getPlayer() !== undefined &&
            getPlayer().answers !== null &&
            getPlayer().answers !== undefined &&
            getPlayer().answers[room.currentQuestion] !== null &&
            getPlayer().answers[room.currentQuestion] !== undefined
        )
            setOptionSelected(getPlayer().answers[room.currentQuestion].optionIndex)
        else
            setOptionSelected()
    }

    function answerControl(option) {
        const player = getPlayer()
        if (optionSelected === option) {
            setOptionSelected()
            delete player.answers[room.currentQuestion]
            socket.emit("updatePlayer", player, code)
        }
        else {
            setOptionSelected(option)
            const attPlayer = {
                ...player,
                answers: {
                    ...player.answers,
                    [room.currentQuestion]: {
                        ...quiz.questions[room.currentQuestion].options[option],
                        questionIndex: room.currentQuestion,
                        optionIndex: option,
                    }
                }
            }
            socket.emit("updatePlayer", attPlayer, code)
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
            const attPlayer = {
                ...player,
                currentQuestion: player.currentQuestion + 1,
                state: showResult ? 'result' : player.state,
                answers: {
                    ...player.answers,
                    [player.currentQuestion]: {
                        ...quiz.questions[player.currentQuestion].options[option],
                        questionIndex: player.currentQuestion,
                        optionIndex: option,
                    },
                },
            }
            socket.emit("updatePlayer", attPlayer, code)
        }, TRANSITION_DURATION * 2.1 + 400)
    }

    function turnOffTransition() {
        setTimeout(() => {
            setDisableOptions(false)
            setQuestionTransition(false)
        }, TRANSITION_DURATION)
    }

    function joinQuiz() {
        socket.emit("joinRoom",
            {
                user: session.user,
                currentQuestion: 0,
                state: 'answering'
            }, code
        )
    }

    function leaveQuiz() {
        if (room.private)
            lockRoom()
        setJoined(false)
        socket.emit(
            "leaveRoom",
            session.user.id,
            code
        )
    }

    function lockRoom() {
        setLocked(true)
    }

    function unlockRoom() {
        setLocked(false)
    }

    async function getPlayerResults() {
        if (room && quiz && getPlayer() && !getPlayer().results) {
            const player = getPlayer()
            let newPlayer
            if (player) {
                newPlayer = {
                    ...player,
                    results: quiz.results.map(result => ({
                        ...result,
                        img: {
                            ...result.img,
                            content: '',
                        },
                        points: player.answers ?
                            Object.keys(player.answers)
                                .reduce((acc, key) =>
                                    acc + player.answers[key].actions.reduce((accumulator, action) =>
                                        action.profile === result.name
                                            ? accumulator + action.points
                                            : accumulator
                                        , 0)
                                    , 0)
                            : 0
                    }))
                        .sort((a, b) => b.points - a.points).reduce((acc, result) => acc.length === 0 || acc[0].points === result.points ? [...acc, result] : acc, [])
                }
            }
            return newPlayer
        }
    }

    function getAllResults() {
        const player = getPlayer()
        if (player) {
            return quiz.results.map(result => ({
                ...result,
                points: player.answers
                    ? Object.keys(player.answers)
                        .reduce((acc, key) =>
                            acc + player.answers[key].actions.reduce((accumulator, action) =>
                                action.profile === result.name
                                    ? accumulator + action.points
                                    : accumulator
                                , 0)
                            , 0)
                    : 0
            }))
                .sort((a, b) => b.points - a.points)
        }
        return []
    }

    function getAllSubResults() {
        const player = getPlayer()
        if (player) {
            return quiz.subResults?.map(result => ({
                ...result,
                points: player.answers
                    ? Object.keys(player.answers)
                        .reduce((acc, key) =>
                            acc + player.answers[key].actions.reduce((accumulator, action) =>
                                action.profile === result.name
                                    ? accumulator + action.points
                                    : accumulator
                                , 0)
                            , 0)
                    : 0
            }))
                .sort((a, b) => b.points - a.points)
        }
        return []
    }

    function getPlayer() {
        return room.players ? room.players[session.user.id] : null
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
        <div className='flex size100'>
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <motion.div id={styles.container}
                    className='flex size100'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [.62, -0.18, .32, 1.17] }}
                >
                    <div className='flex size100'>
                        {room &&
                            <div id={styles.bodyContainer}>
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
                                                            spellCheck={false}
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
                                    <div id={styles.activeContainer}>
                                        <motion.div
                                            id={styles.questionContainer}
                                            initial={{ opacity: 0 }}
                                            animate={questionTransition ? { opacity: 0 } : { opacity: 1 }}
                                            transition={{ duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                                        >
                                            <h2>
                                                {`${room.control
                                                    ? room.currentQuestion + 1
                                                    : getPlayer().currentQuestion + 1
                                                    }
                                                . 
                                                ${quiz.questions[
                                                        room.control
                                                            ? room.currentQuestion
                                                            : getPlayer().currentQuestion].content
                                                    }`
                                                }
                                            </h2>
                                        </motion.div>
                                        <motion.div
                                            id={styles.optionsContainer}
                                            variants={container}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {quiz.questions[room.control
                                                ? room.currentQuestion
                                                : getPlayer().currentQuestion
                                            ].options.map((option, i) =>
                                                i < 4 || quiz.questions[room.currentQuestion].haveExtraOptions
                                                    ? <motion.div
                                                        style={{
                                                            width: '100%',
                                                            height: `${i < 4 || quiz.questions[room.currentQuestion].haveExtraOptions
                                                                ? 25
                                                                : (100 / 6)
                                                                }%`
                                                        }}
                                                        key={`Option: ${i}`}
                                                        variants={item}
                                                    >
                                                        <OptionInput
                                                            onClick={() => room.control ? answerControl(i) : answer(i)}
                                                            state={optionSelected === undefined
                                                                ? undefined
                                                                : optionSelected === i
                                                                    ? 'chosen'
                                                                    : 'notChosen'
                                                            }
                                                            borderRadius={quiz.style.button.borderRadius}
                                                            textColor={quiz.style.button.textColor}
                                                            symbolColor={quiz.style.button.symbolColor}
                                                            option={i}
                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                ? quiz.style.button.color
                                                                : undefined
                                                            }
                                                            symbol={quiz.style.button.symbol}
                                                            variant={quiz.style.button.variant}
                                                            text={option.content}
                                                            width='100%'
                                                            height='100%'
                                                            hideText={questionTransition}
                                                        />
                                                    </motion.div>
                                                    : undefined
                                            )}
                                        </motion.div>
                                    </div>
                                }
                                {quiz && room.state === 'finish' && joined &&
                                    <div>
                                        <h2>Finalizado</h2>
                                    </div>
                                }
                                {quiz && getPlayer() && (room.state === 'results' || getPlayer().state === 'result') && getPlayer().results && joined &&
                                    <motion.div
                                        id={styles.resultContainer}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: TRANSITION_DURATION / 2000, duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                                    >
                                        {layout.map((item, i) =>
                                            <div
                                                className={`${styles.resultBlock} flex center`}
                                                key={i}
                                            >
                                                {item.value}
                                            </div>
                                        )}
                                    </motion.div>
                                }
                            </div>
                        }
                    </div>
                </motion.div>
            }
        </div >
    )
})