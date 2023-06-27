import { withRouter } from 'next/router'
import styles from '../styles/controller.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { color, motion } from "framer-motion"
import { Button, ButtonGroup, FormControlLabel, Switch } from '@mui/material';
import NoSessionPage from '@/components/NoSessionPage';
import { getStandardQuiz, getUserQuiz } from '../../utils/api-caller';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

let socket;

export default withRouter((props) => {
    const { session, signIn } = props
    const [room, setRoom] = useState()
    const [state, setState] = useState('none')
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [quiz, setQuiz] = useState()
    const [quizTab, setQuizTab] = useState('mine')

    const { code } = props.router.query

    useEffect(() => {
        if (!room && code && session) {
            socketInitializer()
        }
    }, [session, code])

    useEffect(() => {
        console.log(room)
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

    const nextQuestion = () => {
        if (room.currentQuestion >= quiz.questions.length - 1)
            socket.emit("updateRoom", { ...room, state: 'finish' })
        else
            socket.emit("updateRoom", { ...room, currentQuestion: room.currentQuestion + 1 })
    }

    const prevQuestion = () => {
        if (room.currentQuestion > 0)
            socket.emit("updateRoom", { ...room, currentQuestion: room.currentQuestion - 1 })
    }

    function showResults() {
        socket.emit("updateRoom", { ...room, state: 'results' })
    }

    const resetQuiz = () => {
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

    function changeQuizTab(newTab) {
        setQuizTab(newTab)
    }

    function handleChooseQuiz(quizInfo) {
        socket.emit("updateRoom", {
            ...room,
            quizInfo: quizInfo,
            state: 'active',
        })
        setState('quizControl')
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
                                {session.user.id === room.owner.id &&
                                    <div id={styles.ownerView}>
                                        {state === 'none' &&
                                            <div id={styles.menu}>
                                                <Button
                                                    onClick={() => changeState('quizSelector')}
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Jogar Quiz
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Fazer Enquete
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Modo Q&A
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    QR Code
                                                </Button>
                                            </div>
                                        }
                                        {state === 'quizSelector' &&
                                            <div id={styles.quizMenu}>
                                                <div id={styles.quizHead}>
                                                    <Button
                                                        onClick={() => changeState('none')}
                                                        startIcon={<ArrowBackRoundedIcon />}
                                                        sx={{
                                                            color: 'white',
                                                            height: '100%',
                                                        }}
                                                    >
                                                        Voltar
                                                    </Button>
                                                </div>
                                                <div id={styles.quizBody}>
                                                    <div id={styles.quizSelector}>
                                                        <Button
                                                            onClick={() => changeQuizTab('mine')}
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                transition: 'all ease-out 200ms',
                                                                width: '100%',
                                                                height: '7%',
                                                                color: quizTab === 'mine'
                                                                    ? 'var(--primary)'
                                                                    : 'white',
                                                            }}
                                                        >
                                                            Meus
                                                        </Button>
                                                        <Button
                                                            onClick={() => changeQuizTab('quizTime')}
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                transition: 'all ease-out 200ms',
                                                                width: '100%',
                                                                height: '7%',
                                                                color: quizTab === 'quizTime'
                                                                    ? 'var(--primary)'
                                                                    : 'white',
                                                            }}                                                    >
                                                            Quiz Time
                                                        </Button>
                                                        <Button
                                                            onClick={() => changeQuizTab('community')}
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                transition: 'all ease-out 200ms',
                                                                width: '100%',
                                                                height: '7%',
                                                                color: quizTab === 'community'
                                                                    ? 'var(--primary)'
                                                                    : 'white',
                                                            }}                                                    >
                                                            Comunidade
                                                        </Button>
                                                    </div>
                                                    <div id={styles.selectorBarContainer}>
                                                        <div
                                                            id={styles.selectorBar}
                                                            style={{
                                                                transition: 'all ease-out 200ms',
                                                                top: quizTab === 'mine'
                                                                    ? '0'
                                                                    : quizTab === 'quizTime'
                                                                        ? '7%'
                                                                        : quizTab === 'community'
                                                                            ? '14%'
                                                                            : '0'
                                                            }}
                                                        >
                                                        </div>
                                                    </div>
                                                    <div id={styles.quizzesContainer}>
                                                        {quizTab === 'mine' &&
                                                            session.user.quizzesInfo.map((quizInfo, i) =>
                                                                <div
                                                                    key={i}
                                                                    className={styles.quizOption}
                                                                >
                                                                    <Button onClick={() => handleChooseQuiz(quizInfo)}>
                                                                        {quizInfo.name}
                                                                    </Button>
                                                                    <Button onClick={resetQuiz}>
                                                                        Reset
                                                                    </Button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {state === 'quizControl' &&
                                            <div id={styles.quizControl}>
                                                <FormControlLabel
                                                    control={<Switch />}
                                                    label="Free-Play:"
                                                    labelPlacement="start"
                                                    /* onChange={handleNewIsPrivate}
                                                    checked={newRoom.private} */
                                                />
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Voltar Pergunta
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Próxima Pergunta
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Mostrar Estatística
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color='error'
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '22px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Cancelar Quiz
                                                </Button>
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
                                {session.user.id !== room.owner.id &&
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