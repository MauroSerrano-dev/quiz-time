import { useEffect, useState } from 'react';
import styles from '../styles/quizBuilder.module.css'
import { useRouter } from 'next/router';
import { motion } from "framer-motion"
import NoSessionPage from '@/components/NoSessionPage';
import { Button, TextField, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const GAME_MODES = [
    { name: 'Profile' },
    { name: 'Certa Resposta' },
    { name: "Who's Most Likely To" },
]

const INICIAL_QUIZ = {
    name: 'My Quiz Name',
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

    function handleNameChange(event) {
        setQuiz(prev => { return { ...prev, name: event.target.value } })
    }

    function handleDragEnd(result) {
        if (!result.destination) {
            return
        }

        const questions = Array.from(quiz.questions)
        const [reorderedQuestion] = questions.splice(result.source.index, 1)
        questions.splice(result.destination.index, 0, reorderedQuestion)

        setQuiz(prev => ({
            ...prev,
            questions,
        }))
    }

    function handleAddQuestion() {
        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, INICIAL_QUIZ.questions[0]]
        }))
    }

    function handleQuestionChange(event, index) {
        const index2 = 2
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                index2 === i
                    ? { ...question, content: event.target.value }
                    : question
            )
        }))
    }

    function handleOptionChange(event) {

    }

    function handleDeleteSlide(index) {
        setQuiz((prev, i) => ({
            ...prev,
            questions: prev.questions.filter((question, i) => i != index)
        }))
    }

    function handleDuplicateSlide(index) {
        setQuiz((prev, i) => ({
            ...prev,
            questions: prev.questions.slice(0, index + 1)
                .concat(prev.questions[index])
                .concat(prev.questions.slice(index + 1, prev.questions.length))

        }))
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
                    transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}>
                    {!quiz.mode
                        ? <div className='flex-center'>
                            <h1>Escolha um Quiz!</h1>
                            <div id={styles.optionsContainer}>
                                {GAME_MODES.map((gMode, i) =>
                                    <div key={`Game Mode: ${i}`} className={styles.gameOption} onClick={() => handleSelectMode(gMode.name)}>
                                        <h2>{gMode.name}</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                        : <div id={styles.editorContainer}>
                            <div id={styles.editorHead}>
                                <h3>{quiz.name}</h3>
                                <input value={quiz.name} onChange={handleNameChange} />
                            </div>
                            <div id={styles.editorBody}>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <div id={styles.leftContainer}>
                                        <Droppable droppableId="slides">
                                            {(provided, snapshot) => (
                                                <div
                                                    id={styles.slidesContainer}
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {quiz.questions.map((question, i) =>
                                                        <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    className={styles.slideContainer}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <div className={styles.buttonsContainer} >
                                                                        <IconButton onClick={() => handleDeleteSlide(i)} size='small' aria-label="delete">
                                                                            <DeleteForeverIcon />
                                                                        </IconButton>
                                                                        <IconButton onClick={() => handleDuplicateSlide(i)} size='small' aria-label="copy">
                                                                            <ContentCopyIcon />
                                                                        </IconButton>
                                                                    </div>
                                                                    <div className={styles.slide}>
                                                                        <h1>{question.content}</h1>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )}
                                                    {provided.placeholder}
                                                    <Button id={styles.addQuestionButton} onClick={handleAddQuestion} variant='contained' >Adicionar Pergunta</Button>
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                </DragDropContext>
                                <div id={styles.middleContainer}>
                                    <TextField onChange={handleQuestionChange} variant='filled' />
                                    <TextField onChange={handleOptionChange} variant='filled' />
                                    <TextField onChange={handleOptionChange} variant='filled' />
                                    <TextField onChange={handleOptionChange} variant='filled' />
                                    <TextField onChange={handleOptionChange} variant='filled' />
                                </div>
                                <div id={styles.rightContainer}>
                                </div>
                            </div>
                        </div>
                    }
                </motion.div>
            }
        </div>
    )
}
