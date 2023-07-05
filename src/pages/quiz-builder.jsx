import { useEffect, useState } from 'react';
import styles from '../styles/quizBuilder.module.css'
import { useRouter } from 'next/router';
import { motion } from "framer-motion"
import NoSessionPage from '@/components/NoSessionPage';
import ProfileEditor from '@/components/ProfileEditor';
import io from "socket.io-client";
const { v4: uuidv4 } = require('uuid');

let socket;

const GAME_MODES = [
    { name: 'Perfil Comportamental', value: 'profile' },
    { name: 'Right or Wrong', value: 'rightOrWorng'  },
    { name: "Who's Most Likely To", value: 'who'  },
]

const INICIAL_ACTION = {
    profile: '',
    points: 1
}

const INICIAL_IMG = {
    content: '',
    name: '',
    type: '',
    ref: '',
}

const INICIAL_OPTION = {
    content: '',
    actions: [
        INICIAL_ACTION
    ],
    img: INICIAL_IMG,
}

const INICIAL_QUESTION = {
    id: 'question-0',
    type: 'standard',
    content: '',
    options: [
        INICIAL_OPTION,
        INICIAL_OPTION,
        INICIAL_OPTION,
        INICIAL_OPTION,
        INICIAL_OPTION,
        INICIAL_OPTION,
    ],
    img: INICIAL_IMG,
    optionsRandom: false,
    haveExtraOptions: false,
    haveTimer: false,
    timerSeconds: 30,
    timerMinutes: 1,
}

const INICIAL_QUIZ = {
    name: '',
    id: uuidv4(),
    category: '',
    style: {
        question: {
            color: '#FDFDFD',
            variant: 'outlined',
            borderRadius: 10,
        },
        button: {
            color: '#009FDA',
            variant: 'contained',
            template: 'monochrome',
            symbol: 'polygons',
            symbolColor: '#1C222C',
            textColor: '#1C222C',
            borderRadius: 10,
        },
        background: {
            color: '#1C222C',
            type: 'solid',
            gradientColors: ['#1C222C', '#343F52'],
            gradientPercentages: [0, 100],
            angle: 165,
        },
    },
    results: [
        {
            id: 'profile-0',
            name: 'Perfil 1',
            color: '#FFCCB6',
            img: {
                content: '',
                name: '',
                type: ''
            },
        },
        {
            id: 'profile-1',
            name: 'Perfil 2',
            color: '#ABDEE6',
            img: {
                content: '',
                name: '',
                type: ''
            },
        },
        {
            id: 'profile-2',
            name: 'Perfil 3',
            color: '#CCE2CB',
            img: {
                content: '',
                name: '',
                type: ''
            },
        },
    ],
    questions: [
        {
            id: 'question-0',
            ...INICIAL_QUESTION
        },
    ],
    layout: [
        { name: 'Image' },
        { name: 'ChartPie', legend: true },
    ]
}

export default function QuizBuilder(props) {
    const { session, signIn } = props

    const [building, setBuilding] = useState(false)
    const [canSave, setCanSave] = useState(true)
    const [quiz, setQuiz] = useState(INICIAL_QUIZ)
    const router = useRouter()

    useEffect(() => {
        if (!socket)
            socketInitializer()
        else {
            socket.emit("saveSketch",
                session.user.id,
                session.user.email,
                {
                    ...quiz,
                    questions: quiz.questions.map((question, i) =>
                    ({
                        ...question,
                        img: { id: question.img.id },
                        options: question.options.map((option, j) =>
                        ({
                            ...option,
                            img: { id: option.img.id }
                        }))
                    })),
                    results: quiz.results.map((result, i) =>
                    ({
                        ...result,
                        img: { id: result.img.id }
                    })),
                }
            )
        }
    }, [quiz])

    const socketInitializer = async () => {
        const options = {
            method: 'GET'
        }
        await fetch("/api/socket", options)

        socket = io()
    }

    useEffect(() => {
        if (building) {
            const message = "Tem certeza que deseja sair?\nSe você sair agora, perderá todo o progresso da criação do quiz."
            const handleBeforeUnload = (event) => {

                event.preventDefault();
                event.returnValue = message;
                return message
            }
            const handleNavigateAway = (event) => {
                event.preventDefault()
                event.returnValue = message
                return message;
            }
            const handleRouteChange = (url) => {
                if (!window.confirm(message)) {
                    router.events.emit('routeChangeError')
                    throw 'Abortando navegação'
                }
            }
            router.events.on('routeChangeStart', handleRouteChange)

            window.addEventListener('beforeunload', handleBeforeUnload)
            window.addEventListener('unload', handleNavigateAway)
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload)
                window.removeEventListener('unload', handleNavigateAway)
                router.events.off('routeChangeStart', handleRouteChange)
            }
        }
    }, [building])

    function handleSelectMode(gModeName) {
        setBuilding(true)
        setQuiz(prev => { return { ...prev, mode: gModeName } })
    }

    return (
        <div
            id={styles.container}
        >
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <motion.div
                    id={styles.sessionContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}
                >
                    {!quiz.mode
                        ? <div className='flex center'>
                            <h1>Escolha um Quiz!</h1>
                            <div id={styles.optionsContainer}>
                                {GAME_MODES.map((gMode, i) =>
                                    <div
                                        key={`Game Mode: ${i}`}
                                        className={styles.gameOption}
                                        onClick={() => handleSelectMode(gMode.value)}
                                    >
                                        <h2>{gMode.name}</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                        : quiz.mode === 'profile' &&
                        <ProfileEditor
                            session={session}
                            quiz={quiz}
                            setQuiz={setQuiz}
                            INICIAL_QUIZ={INICIAL_QUIZ}
                            INICIAL_QUESTION={INICIAL_QUESTION}
                            INICIAL_OPTION={INICIAL_OPTION}
                            INICIAL_ACTION={INICIAL_ACTION}
                            INICIAL_IMG={INICIAL_IMG}
                        />
                    }
                </motion.div>
            }
        </div>
    )
}