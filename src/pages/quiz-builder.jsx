import { useEffect, useState } from 'react';
import styles from '../styles/quizBuilder.module.css'
import { useRouter } from 'next/router';
import { motion } from "framer-motion"
import NoSessionPage from '@/components/NoSessionPage';
import ProfileEditor from '@/components/ProfileEditor';

const GAME_MODES = [
    { name: 'Profile' },
    { name: 'Right or Wrong' },
    { name: "Who's Most Likely To" },
]

const INICIAL_QUIZ = {
    name: 'My Quiz Name',
    style: {
        button: {
            color: '#009fda',
            variant: 'contained',
            template: 'monochrome',
            symbol: 'letters'
        },
    },
    results: [
        {
            name: 'Perfil 1',
            color: '#ffccb6',
            img: {
                content: '',
                name: '',
                type: ''
            }
        },
        {
            name: 'Perfil 2',
            color: '#abdee6',
            img: {
                content: '',
                name: '',
                type: ''
            },
        },
        {
            name: 'Perfil 3',
            color: '#cce2cb',
            img: {
                content: '',
                name: '',
                type: ''
            }
        },
    ],
    questions: [
        {
            content: '1',
            options: [
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
            ],
            optionsRandom: false
        },
        {
            content: '2',
            options: [
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
            ],
            optionsRandom: false
        },
        {
            content: '3',
            options: [
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
            ],
            optionsRandom: false
        },
        {
            content: '4',
            options: [
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
            ],
            optionsRandom: false
        },
        {
            content: '5',
            options: [
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
                { content: '', action: {} },
            ],
            optionsRandom: false
        },
    ]
}

export default function QuizBuilder(props) {
    const { session, signIn } = props

    const [building, setBuilding] = useState(false)
    const [quiz, setQuiz] = useState(INICIAL_QUIZ)
    const router = useRouter()

    useEffect(() => {
        console.log(quiz)
    }, [quiz])

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
                        ? <div className='flex-center'>
                            <h1>Escolha um Quiz!</h1>
                            <div id={styles.optionsContainer}>
                                {GAME_MODES.map((gMode, i) =>
                                    <div
                                        key={`Game Mode: ${i}`}
                                        className={styles.gameOption}
                                        onClick={() => handleSelectMode(gMode.name)}
                                    >
                                        <h2>{gMode.name}</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                        : quiz.mode === 'Profile' &&
                        <ProfileEditor
                            quiz={quiz}
                            setQuiz={setQuiz}
                            INICIAL_QUIZ={INICIAL_QUIZ}
                        />
                    }
                </motion.div>
            }
        </div>
    )
}
