import { useEffect, useState } from 'react';
import styles from '../styles/quizBuilder.module.css'
import { useRouter } from 'next/router';
import { motion } from "framer-motion"
import NoSessionPage from '@/components/NoSessionPage';

const GAME_MODES = [
    { name: 'Profile' },
    { name: 'Certa Resposta' },
    { name: "Who's Most Likely To" },
]

export default function QuizBuilder(props) {
    const { session } = props

    const [building, setBuilding] = useState(false)
    const [quiz, setQuiz] = useState({ name: 'My Quiz Name' })
    const router = useRouter();

    useEffect(() => {
        if (building) {
            const message = "Tem certeza que deseja sair?\nSe você sair agora, perderá todo o progresso da criação do quiz."
            const handleBeforeUnload = (event) => {

                event.preventDefault();
                event.returnValue = message;
                return message;
            }
            const handleNavigateAway = (event) => {
                event.preventDefault();
                event.returnValue = message;
                return message;
            }
            const handleRouteChange = (url) => {
                if (!window.confirm(message)) {
                    router.events.emit('routeChangeError');
                    throw 'Abortando navegação';
                }
            }
            router.events.on('routeChangeStart', handleRouteChange);

            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('unload', handleNavigateAway);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                window.removeEventListener('unload', handleNavigateAway);
                router.events.off('routeChangeStart', handleRouteChange);
            }
        }
    }, [building])

    function handleSelectMode(gModeName) {
        setBuilding(true)
        setQuiz(prev => { return { ...prev, mode: gModeName } })
    }

    function handleNameChange(event) {
        setQuiz(prev => { return { ...prev, name: event.target.value } })
    }

    return (
        <div>
            {session === null
                ? <NoSessionPage />
                : <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}>            <main>
                        <h1>Quiz Builder!</h1>
                        {!quiz.mode
                            ? <div id={styles.optionsContainer}>
                                {GAME_MODES.map((gMode, i) =>
                                    <div key={`Game Mode: ${i}`} id={styles.gameOption} onClick={() => handleSelectMode(gMode.name)}>
                                        <h2>{gMode.name}</h2>
                                    </div>)
                                }
                            </div>
                            : <div id={styles.editorContainer}>
                                <h3>{quiz.name}</h3>
                                <input value={quiz.name} onChange={handleNameChange} />
                            </div>
                        }
                    </main>
                </motion.div>
            }
        </div>
    )
}
