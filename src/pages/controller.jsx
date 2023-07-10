import { withRouter } from 'next/router'
import styles from '../styles/controller.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { Button, FormControlLabel, Switch } from '@mui/material';
import NoSessionPage from '@/components/NoSessionPage';
import { getAllQuizzesStandardInfo, getStandardQuiz, getUserQuiz } from '../../utils/api-caller';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayersList from '@/components/PlayersList';

let socket;

export default withRouter((props) => {
    const { session, signIn } = props
    const [room, setRoom] = useState()
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [quizzesStandard, setQuizzesStandard] = useState([])
    const [quizTab, setQuizTab] = useState('mine')

    const { code } = props.router.query

    useEffect(() => {
        async function getAllQuizzesInfo() {
            await getAllQuizzesStandardInfo()
                .then(response => response.json())
                .then(response => setQuizzesStandard(response.quizzes))
                .catch(err => console.error(err))
        }
        getAllQuizzesInfo()
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

                socket.on(`sendRoom${code}`, (room) => {
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

            socketInitializer()
        }
    }, [session, code])

    function nextQuestion() {
        if (room.state === 'active') {
            if (room.currentQuestion >= room.quizInfo.totalQuestions - 1) {
                socket.emit(`saveResults`, code)
                socket.emit("updateRoom", {
                    ...room,
                    state: 'finish'
                })
            }
            else
                socket.emit("updateRoom", {
                    ...room,
                    currentQuestion: room.currentQuestion + 1
                })
        }
    }

    function prevQuestion() {
        if (room.currentQuestion > 0 && room.state === 'active')
            socket.emit("updateRoom", {
                ...room,
                currentQuestion:
                    room.currentQuestion - 1
            })
    }

    function showResults() {
        socket.emit("updateRoom", {
            ...room,
            state: 'results'
        })
    }

    const resetQuiz = () => {
        setDisableShow(true)
        setActiveShow(false)
        setTimeout(() => {
            socket.emit("updateRoom", {
                ...room, state: 'disable',
                currentQuestion: 0,
                players: []
            })
        }, 600)
    }

    function startQuiz() {
        setDisableShow(false)
        setActiveShow(true)
        setTimeout(() => {
            socket.emit("updateRoom", {
                ...room,
                state: 'active'
            })
        }, 600)
    }

    function switchControl(isControl) {
        socket.emit("updateRoom", {
            ...room,
            control: isControl
        })
    }

    function changeState(newState) {
        socket.emit("updateRoom", {
            ...room,
            controllerState: newState
        })
    }

    function handleBackToMenu() {
        changeState('menu')
        setQuizTab('mine')
    }

    function changeQuizTab(newTab) {
        setQuizTab(newTab)
    }

    function handleChooseQuiz(quizInfo) {
        socket.emit("updateRoom", {
            ...room,
            quizInfo: quizInfo,
            controllerState: 'quizControl',
        })
    }

    function handleStartQuiz() {
        socket.emit("updateRoom", {
            ...room,
            state: 'active',
        })
    }

    function handleShowStatistic() {
    }

    function handleShowResults() {
        socket.emit("updateRoom", {
            ...room,
            state: 'results'
        })
    }

    function handleCancelQuiz() {
        let newPlayersList = room.players

        if (room.players) {
            Object.keys(newPlayersList).forEach(playerId => {
                delete newPlayersList[playerId].results
                delete newPlayersList[playerId].answers
            })
        }

        socket.emit("updateRoom", {
            ...room,
            state: 'disable',
            currentQuestion: 0,
            players: newPlayersList
        })
    }

    function handleSwitchControl(event) {
        socket.emit("updateRoom", {
            ...room,
            control: !event.target.checked
        })
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
                                        {room.controllerState === 'menu' &&
                                            <div id={styles.menu}>
                                                <Button
                                                    onClick={() => changeState('quizSelector')}
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100%',
                                                        height: '130px',
                                                        fontSize: '17px',
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
                                                        fontSize: '17px',
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
                                                        fontSize: '17px',
                                                        lineHeight: '29px',
                                                    }}
                                                >
                                                    Começar Q&A
                                                </Button>
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_SITE_URL}/room?code=${code}`}
                                                    target='_blank'
                                                    className='fillWidth'
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        sx={{
                                                            width: '100%',
                                                            height: '130px',
                                                            fontSize: '17px',
                                                            lineHeight: '29px',
                                                        }}
                                                    >
                                                        Abrir Telão
                                                    </Button>
                                                </a>
                                            </div>
                                        }
                                        {room.controllerState === 'quizSelector' &&
                                            <div id={styles.quizMenu}>
                                                <div id={styles.quizHead}>
                                                    <Button
                                                        onClick={handleBackToMenu}
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
                                                            }}
                                                        >
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
                                                            }}
                                                        >
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
                                                            session.user.quizzesInfos.map((quizInfo, i) =>
                                                                <div
                                                                    key={i}
                                                                    className={styles.quizOption}
                                                                >
                                                                    <Button onClick={() => handleChooseQuiz(quizInfo)}>
                                                                        {quizInfo.name}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        }
                                                        {quizTab === 'quizTime' &&
                                                            quizzesStandard.map((quizInfo, i) =>
                                                                <div
                                                                    key={i}
                                                                    className={styles.quizOption}
                                                                >
                                                                    <Button onClick={() => handleChooseQuiz(quizInfo)}>
                                                                        {quizInfo.name}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {room.controllerState === 'quizControl' && (
                                            room.state === 'disable'
                                                ? <div>
                                                    <Button
                                                        onClick={handleBackToMenu}
                                                        startIcon={<ArrowBackRoundedIcon />}
                                                        sx={{
                                                            color: 'white',
                                                            height: '100%',
                                                        }}
                                                    >
                                                        Voltar
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleStartQuiz}
                                                        sx={{
                                                            width: '100%',
                                                            height: '130px',
                                                            fontSize: '17px',
                                                            lineHeight: '29px',
                                                        }}
                                                    >
                                                        Começar Quiz
                                                    </Button>
                                                </div>
                                                : <div id={styles.quizControl}>
                                                    <FormControlLabel
                                                        control={<Switch />}
                                                        label="Free-Play:"
                                                        labelPlacement="start"
                                                        onChange={handleSwitchControl}
                                                        checked={!room.control}
                                                    />
                                                    <div className='flex row'>
                                                        <Button
                                                            onClick={prevQuestion}
                                                            variant="outlined"
                                                            sx={{
                                                                width: '100%',
                                                                height: '130px',
                                                                fontSize: '17px',
                                                                lineHeight: '29px',
                                                            }}
                                                        >
                                                            Voltar Pergunta
                                                        </Button>
                                                        <Button
                                                            onClick={nextQuestion}
                                                            variant="outlined"
                                                            sx={{
                                                                width: '100%',
                                                                height: '130px',
                                                                fontSize: '17px',
                                                                lineHeight: '29px',
                                                            }}
                                                        >
                                                            Próxima Pergunta
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleShowResults}
                                                        sx={{
                                                            width: '100%',
                                                            height: '130px',
                                                            fontSize: '17px',
                                                            lineHeight: '29px',
                                                        }}
                                                    >
                                                        Mostrar Resultados
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleShowStatistic}
                                                        sx={{
                                                            width: '100%',
                                                            height: '130px',
                                                            fontSize: '17px',
                                                            lineHeight: '29px',
                                                        }}
                                                    >
                                                        Mostrar Estatística
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleCancelQuiz}
                                                        color='error'
                                                        sx={{
                                                            width: '100%',
                                                            height: '130px',
                                                            fontSize: '17px',
                                                            lineHeight: '29px',
                                                        }}
                                                    >
                                                        Cancelar Quiz
                                                    </Button>
                                                </div>
                                        )}
                                        <PlayersList
                                            players={room.players === undefined ? [] : Object.keys(room.players).map(index => room.players[index])}
                                            totalQuestions={room.quizInfo.totalQuestions}
                                        />
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