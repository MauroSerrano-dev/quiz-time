import styles from '../styles/components/ProfileEditor.module.css'
import {
    Button,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Slider,
    Switch,
    TextField,
} from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import React, { useEffect } from 'react';
import { motion } from "framer-motion"
import { useState } from 'react'
import { showErrorToast } from '../../utils/toasts'
import FileInput from './FileInput'
import Stepper from './Stepper'
import Modal from './Modal'
import Step from './Step';
import ColorInput from './ColorInput';
import OptionInput from './OptionInput'
import { CustomTextField } from '../../utils/mui'
import QuestionField from './QuestionField'
import $ from 'jquery'
import Router from "next/router";

// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import QuizIcon from '@mui/icons-material/Quiz'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PaletteIcon from '@mui/icons-material/Palette'
import LiveHelpRoundedIcon from '@mui/icons-material/LiveHelpRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import GamepadRoundedIcon from '@mui/icons-material/GamepadRounded'
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded'
import PersonIcon from '@mui/icons-material/Person'
import PhotoSizeSelectActualRoundedIcon from '@mui/icons-material/PhotoSizeSelectActualRounded'
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import TimerRoundedIcon from '@mui/icons-material/TimerRounded'
import { BsTriangleFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import PentagonRoundedIcon from '@mui/icons-material/PentagonRounded'
import HexagonRoundedIcon from '@mui/icons-material/HexagonRounded'
import SquareRoundedIcon from '@mui/icons-material/SquareRounded'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'

const ANIMATION_FIELDS = [.59, 0, .03, 1.23]
const ANIMATION_COLUMNS_DURATION = 300
const ANIMATION_COLUMNS = `all ${ANIMATION_COLUMNS_DURATION}ms cubic-bezier(.59, 0, .03, 1.23)`

const CATEGORIES = [
    { value: 'personality', label: 'Teste de Personalidade' },
    { value: 'fun', label: 'Divertido' },
    { value: 'other', label: 'Outro' },
]

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const ICONS_POLYGONS = [
    <BsTriangleFill size={20} style={{ color: '#1c222c', scale: 2 }} />,
    <CircleRoundedIcon style={{ color: '#1c222c' }} />,
    <SquareRoundedIcon style={{ color: '#1c222c' }} />,
    <IoClose color='#1c222c' size={25} style={{ strokeWidth: '45px', marginRight: '-0.1rem' }} />,
    <PentagonRoundedIcon style={{ color: '#1c222c' }} />,
    <HexagonRoundedIcon style={{ color: '#1c222c' }} />,
]

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
}

const DESIGN_EDIT_OPTIONS = [
    { title: 'Monocromático', value: 'monochrome' },
    { title: 'Colorido', value: 'colorful' },
    { title: 'Custom', value: 'custom' },
]

const INICIAL_GRADIENT_PERCENTAGES = new Map([
    [2, [0, 100]],
    [3, [0, 50, 100]],
    [4, [0, 33, 67, 100]],
    [5, [0, 25, 50, 75, 100]],
    [6, [0, 20, 40, 60, 80, 100]],
])

const QUESTIONS_TYPES = new Map([
    ['standard', 'Padrão']
])

export default function ProfileEditor(props) {
    const {
        session,
        quiz,
        setQuiz,
        INICIAL_QUIZ,
        INICIAL_QUESTION,
        INICIAL_OPTION,
        INICIAL_ACTION,
        INICIAL_IMG,
    } = props

    const [step, setStep] = useState(0)
    const [stepDelay, setStepDelay] = useState(0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [notInDragNDropState, setNotInDragNDropState] = useState(true)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showModalInfoOpacity, setShowInfoModalOpacity] = useState(false)

    const [attSizeRef, setAttSizeRef] = useState(false)

    const [alreadyShowedModal, setAlreadyShowedModal] = useState(false)
    const [disableCreateQuiz, setDisableCreateQuiz] = useState(false)
    const [middleAllSize, setMiddleAllSize] = useState({
        width: $(`.${styles.middleAll}`).width(),
        height: $(`.${styles.middleAll}`).height()
    })

    useEffect(() => {

        setTimeout(() => {
            setMiddleAllSize({
                width: $(`.${styles.middleAll}`).width(),
                height: $(`.${styles.middleAll}`).height()
            })
        }, 1)

        if (!alreadyShowedModal) {
            setAlreadyShowedModal(true)
            setTimeout(() => {
                openModal()
            }, 200)
        }

        function handleResize() {
            setMiddleAllSize({
                width: $(`.${styles.middleAll}`).width(),
                height: $(`.${styles.middleAll}`).height()
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const BACKGROUND_STYLES = new Map([
        ['solid', {
            backgroundColor: quiz.style.background.color
        }
        ],
        ['gradient', {
            background: `linear-gradient(${quiz.style.background.angle}deg,`
                .concat(quiz.style.background.gradientColors.map((color, i) =>
                    ' '.concat(color.concat(' '.concat(quiz.style.background.gradientPercentages[i])).concat('%'))
                )).concat(')')
        }],
        ['radial', {
            background: 'radial-gradient(circle,'
                .concat(quiz.style.background.gradientColors.map((color, i) =>
                    ' '.concat(color.concat(' '.concat(quiz.style.background.gradientPercentages[i])).concat('%'))
                )).concat(')')
        }],
    ])

    function handleAddQuestion() {
        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, { ...INICIAL_QUESTION, id: getNewQuestionId() }]
        }))
        changeCurrentSlide(quiz.questions.length)
    }

    function handleDeleteQuestion(event, index) {
        event.stopPropagation()
        if (currentSlide === quiz.questions.length - 1)
            setCurrentSlide(quiz.questions.length - 2)
        setQuiz(prev => ({ ...prev, questions: prev.questions.filter((result, i) => index !== i) }))
        setAttSizeRef(prev => !prev)
    }

    function handleDuplicateQuestion(event, index) {
        event.stopPropagation()
        const newQuestionId = getNewQuestionId()

        setQuiz((prev, i) => ({
            ...prev,
            questions: prev.questions.slice(0, index + 1)
                .concat({ ...prev.questions[index], id: newQuestionId })
                .concat(prev.questions.slice(index + 1, prev.questions.length))
        }))
        if (index <= currentSlide)
            setCurrentSlide(prev => prev + 1)
    }

    function handleDragEndProfiles(res) {
        setNotInDragNDropState(false)
        if (res.destination) {
            if (res.source.index === currentSlide)
                setCurrentSlide(res.destination.index)
            else if (res.source.index > currentSlide && res.destination.index <= currentSlide)
                setCurrentSlide(prev => prev + 1)
            else if (res.source.index < currentSlide && res.destination.index >= currentSlide)
                setCurrentSlide(prev => prev - 1)
        }
        else
            return

        const results = Array.from(quiz.results)
        const [reorderedProfiles] = results.splice(res.source.index, 1)
        results.splice(res.destination.index, 0, reorderedProfiles)

        setQuiz(prev => ({
            ...prev,
            results,
        }))
        setTimeout(() => setNotInDragNDropState(true), 300)
    }

    function handleDragEndQuestions(res) {
        setNotInDragNDropState(false)
        if (res.destination) {
            if (res.source.index === currentSlide)
                setCurrentSlide(res.destination.index)
            else if (res.source.index > currentSlide && res.destination.index <= currentSlide)
                setCurrentSlide(prev => prev + 1)
            else if (res.source.index < currentSlide && res.destination.index >= currentSlide)
                setCurrentSlide(prev => prev - 1)
        }
        else
            return

        const questions = Array.from(quiz.questions)
        const [reorderedProfiles] = questions.splice(res.source.index, 1)
        questions.splice(res.destination.index, 0, reorderedProfiles)

        setQuiz(prev => ({
            ...prev,
            questions,
        }))
        setTimeout(() => setNotInDragNDropState(true), 300)
    }

    function getNewQuestionId() {
        for (let i = 0; i < quiz.questions.length + 1; i++) {
            if (quiz.questions.every(result => result.id !== `question-${i}`))
                return `question-${i}`
        }
    }

    function getNewProfileId() {
        for (let i = 0; i < quiz.results.length + 1; i++) {
            if (quiz.results.every(result => result.id !== `profile-${i}`))
                return `profile-${i}`
        }
    }

    function handleAddProfile() {
        if (quiz.results.length >= 16)
            showErrorToast("Número máximo de 16 perfis.", 3000)
        else {
            setQuiz(prev => ({
                ...prev,
                results: [
                    ...prev.results,
                    {
                        name: 'Novo Perfil',
                        id: getNewProfileId(),
                        color: '#009FDA',
                        img: { content: '', name: '', type: '', positionToFit: '' }
                    }]
            }))
            setCurrentSlide(quiz.results.length)
        }
    }

    function handleDeleteProfile(event, resultId) {
        event.stopPropagation()
        if (currentSlide === quiz.results.length - 1)
            setCurrentSlide(quiz.results.length - 2)
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(question => ({
                ...question,
                options: question.options.map(option =>
                (
                    {
                        ...option,
                        actions: option.actions.filter(action =>
                            action.profile !== resultId)
                    }
                ))
            })),
            results: prev.results.filter(result => result.id !== resultId)
        }))
    }

    function handleDuplicateProfile(event, index) {
        event.stopPropagation()
        if (quiz.results.length >= 16)
            showErrorToast("Número máximo de 16 perfis.", 3000)
        else {
            setQuiz((prev, i) => ({
                ...prev,
                results: prev.results.slice(0, index + 1)
                    .concat({ ...prev.results[index], id: getNewProfileId() })
                    .concat(prev.results.slice(index + 1, prev.results.length))

            }))
            if (index <= currentSlide)
                setCurrentSlide(prev => prev + 1)
        }
    }

    function changeCurrentSlide(index) {
        setCurrentSlide(index)
        setAttSizeRef(prev => !prev)
    }

    function handleProfileNameChange(event) {
        setQuiz(prev => ({
            ...prev,
            results: prev.results.map((result, i) =>
                currentSlide === i
                    ? { ...result, name: event.target.value }
                    : result)
        }))
    }

    function handleQuestionChange(event) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                currentSlide === i
                    ? { ...question, content: event.target.value }
                    : question)
        }))
    }

    function handleProfileColor(event) {
        setQuiz(prev => ({
            ...prev,
            results: prev.results.map((result, i) =>
                currentSlide === i
                    ? {
                        ...result, color: typeof event === 'string'
                            ? event
                            : event.target.value
                    }
                    : result)
        }))
    }

    function handleStyleColor(event, objName, fieldName) {
        const newColor = typeof event === 'string'
            ? event.toUpperCase()
            : event.target.value[0] === '#'
                ? event.target.value.length > 7
                    ? quiz.style[objName][fieldName]
                    : event.target.value.toUpperCase()
                : event.target.value.length > 6
                    ? quiz.style[objName][fieldName]
                    : `#${event.target.value.toUpperCase()}`

        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                [objName]: {
                    ...prev.style[objName],
                    [fieldName]: newColor
                }
            }
        }))
    }

    function handleStyleGradientColors(event, objName, fieldName, index) {
        const newColor = typeof event === 'string'
            ? event
            : (event.target.value.length > 7
                ? prev.style.background[fieldName]
                : event.target.value)

        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                [objName]: {
                    ...prev.style[objName],
                    [fieldName]: prev.style[objName][fieldName].slice(0, index)
                        .concat(newColor)
                        .concat(prev.style[objName][fieldName]
                            .slice(index + 1, prev.style[objName][fieldName].length)),
                }
            }
        }))
    }

    function isValidHexColor(string) {
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})$/;
        return regex.test(string)
    }

    function handleButtonBorder(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                button: {
                    ...prev.style.button,
                    borderRadius: event.target.value
                }
            }
        }))
    }

    function handleBackgroundAngle(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                background: {
                    ...prev.style.background,
                    angle: event.target.value
                }
            }
        }))
    }

    function handleBackgroundPercentage(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                background: {
                    ...prev.style.background,
                    gradientPercentages: event.target.value,
                }
            }
        }))
    }

    function handleQuestionBorder(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                question: {
                    ...prev.style.question,
                    borderRadius: event.target.value
                }
            }
        }))
    }

    function closeModal() {
        setShowInfoModalOpacity(false)
        setTimeout(() => {
            setShowInfoModal(false)
        }, 300)
    }

    function openModal() {
        setShowInfoModal(true)
        setTimeout(() => {
            setShowInfoModalOpacity(true)
        }, 300)
    }

    function handleChangeStep(newStep) {
        setStep(newStep)
        setTimeout(() => {
            if (newStep === 1)
                setCurrentSlide(quiz.style.button.template === 'monochrome'
                    ? 0
                    : (quiz.style.button.template === 'colorful' ? 1 : 2)
                )
            else
                setCurrentSlide(0)
            setStepDelay(newStep)
        }, ANIMATION_COLUMNS_DURATION)
    }

    function handleButtonVariantChange(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                button: {
                    ...prev.style.button,
                    variant: event.target.value
                }
            }
        }))
    }

    function handleButtonSymbolChange(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                button: {
                    ...prev.style.button,
                    symbol: event.target.value
                }
            }
        }))
    }

    function handleTemplateChange(index) {
        changeCurrentSlide(index)
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                button: {
                    ...prev.style.button,
                    template: DESIGN_EDIT_OPTIONS[index].value
                }
            }
        }))
    }

    function handleQuestionVariantChange(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                question: {
                    ...prev.style.question,
                    variant: event.target.value
                }
            }
        }))
    }

    function handleBackgroundTypeChange(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                background: {
                    ...prev.style.background,
                    type: event.target.value
                }
            }
        }))
    }

    function addGradientColor() {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                background: {
                    ...prev.style.background,
                    gradientColors: prev.style.background.gradientColors
                        .concat(['#009fda']),
                    gradientPercentages: INICIAL_GRADIENT_PERCENTAGES.get(prev.style.background.gradientPercentages.length + 1)
                }
            }
        }))
    }

    function deleteGradientColor(index) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                background: {
                    ...prev.style.background,
                    gradientColors: prev.style.background.gradientColors
                        .filter((color, i) => i !== index),
                    gradientPercentages: INICIAL_GRADIENT_PERCENTAGES.get(prev.style.background.gradientPercentages.length - 1)
                }
            }
        }))
    }

    function addExtraOptions(index) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                i === index
                    ? { ...question, haveExtraOptions: true }
                    : question
            )
        }))
        setAttSizeRef(prev => !prev)
    }

    function removeExtraOptions(index) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                i === index
                    ? {
                        ...question,
                        haveExtraOptions: false,
                        options: question.options.map((option, j) =>
                            j === 4 || j === 5
                                ? INICIAL_OPTION
                                : option
                        )
                    }
                    : question
            )
        }))
        setAttSizeRef(prev => !prev)
    }

    function handleOptionTextChange(textValue, optionIndex) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                currentSlide === i
                    ? {
                        ...question,
                        options: prev.questions[i].options.map((option, j) =>
                            j === optionIndex
                                ? { ...option, content: textValue }
                                : option
                        )
                    }
                    : question
            )
        }))
    }

    function handleSwitchTimer(event) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                currentSlide === i
                    ? {
                        ...question,
                        haveTimer: event.target.checked,
                        timerMinutes: 1,
                        timerSeconds: 30,
                    }
                    : question
            )
        }))
    }

    function handleChangeQuizField(value, field) {
        setQuiz(prev => ({
            ...prev,
            [field]: value
        }))
    }

    function handleChangeQuestionField(value, field) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                currentSlide === i
                    ? {
                        ...question,
                        [field]: value,
                    }
                    : question
            )
        }))
    }

    function handleChangeOptionActionField(value, field, questionIndex, optionIndex, actionIndex) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                questionIndex === i
                    ? {
                        ...question,
                        options: question.options.map((option, j) => j === optionIndex
                            ? {
                                ...option,
                                actions: option.actions.map((action, k) => k === actionIndex
                                    ? {
                                        ...action,
                                        [field]: value,
                                    }
                                    : action
                                )
                            }
                            : option
                        )
                    }
                    : question
            )
        }))
    }

    function handleChangeOptionActionProfile(value, questionIndex, optionIndex, actionIndex) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                questionIndex === i
                    ? {
                        ...question,
                        options: question.options.map((option, j) => j === optionIndex
                            ? {
                                ...option,
                                actions: option.actions.map((action, k) => k === actionIndex
                                    ? {
                                        ...action,
                                        profile: value,
                                        points: value === 'none' ? 1 : action.points
                                    }
                                    : action
                                )
                            }
                            : option
                        )
                    }
                    : question
            )
        }))
    }

    function addAction(questionIndex, optionIndex) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                questionIndex === i
                    ? {
                        ...question,
                        options: question.options.map((option, j) => j === optionIndex
                            ? {
                                ...option,
                                actions: [...option.actions, INICIAL_ACTION]
                            }
                            : option
                        )
                    }
                    : question
            )
        }))
    }

    function handleDeleteAction(questionIndex, optionIndex, actionIndex) {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                questionIndex === i
                    ? {
                        ...question,
                        options: question.options.map((option, j) => j === optionIndex
                            ? {
                                ...option,
                                actions: option.actions.filter((action, k) => k !== actionIndex)
                            }
                            : option
                        )
                    }
                    : question
            )
        }))
    }

    async function createQuiz(newQuiz) {
        /* if (newQuiz.quizInfo.name === '') {
            showInfoToast("Nenhum Quiz Selecitonado.", 3000)
            return
        }
        if (containsAccents(newQuiz.code)) {
            showInfoToast("O nome não pode conter acentos.", 3000)
            return
        }
        if (!validateCodeCharacters(newQuiz.code)) {
            showInfoToast("O nome deve conter apenas letras, números, espaços ou hífens.", 5000)
            return
        }
        if (!validateCodeLength(newQuiz.code)) {
            showInfoToast("O nome deve conter ao menos 3 letras ou números.", 5000)
            return
        }
        if ((newQuiz.private && newQuiz.password.length < 3)) {
            showInfoToast("A senha deve conter ao menos 3 caracteres.", 5000)
            return
        }
        if (await getRoom(newQuiz.code)) {
            showErrorToast("Sala já existente, por favor escolha outro nome.", 5000)
            return
        } */
        setDisableCreateQuiz(false)

        const options = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'createQuiz',
                userId: session.user.id,
                userEmail: session.user.email,
                userUui: session.user.uui,
            })
        }

        await fetch('/api/users', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
        /* Router.push(`/profile?id=${session.user.id}`) */
    }

    return (
        <motion.div
            id={styles.editorContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}
            style={BACKGROUND_STYLES.get(quiz.style.background.type)}
        >
            {showInfoModal &&
                <Modal
                    width={'550px'}
                    height={'450px'}
                    widthMobile={'350px'}
                    heightMobile={'450px'}
                    widthSmall={'250px'}
                    heightSmall={'450px'}
                    closeModal={closeModal}
                    showModalOpacity={showModalInfoOpacity}
                    head={
                        <h2>Crie seu Quiz em Apenas 5 passos!</h2>
                    }
                    body={
                        <div id={styles.infoBody} >
                            <div className={styles.infoLine}>
                                <div className={styles.stepInfoContainer}>
                                    <Step
                                        stepStyle={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                                            cursor: 'default',
                                        }}
                                        icon={<GroupAddIcon sx={{ color: 'white' }} />}
                                    />
                                </div>
                                <h3 className={styles.infoText} >1. Crie os perfis.</h3>
                            </div>
                            <div className={styles.infoLine}>
                                <div className={styles.stepInfoContainer}>
                                    <Step
                                        stepStyle={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                                            cursor: 'default',
                                        }}
                                        icon={<PaletteIcon sx={{ color: 'white' }} />}
                                    />
                                </div>
                                <h3 className={styles.infoText} >2. Escolha o design.</h3>
                            </div>
                            <div className={styles.infoLine}>
                                <div className={styles.stepInfoContainer} >
                                    <Step
                                        stepStyle={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                                            cursor: 'default',
                                        }}
                                        icon={<QuizIcon sx={{ color: 'white' }} />}
                                    />
                                </div>
                                <h3 className={styles.infoText} >3. Crie as perguntas.</h3>
                            </div>
                            <div className={styles.infoLine}>
                                <div className={styles.stepInfoContainer} >
                                    <Step
                                        stepStyle={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                                            cursor: 'default',
                                        }}
                                        icon={<AssessmentIcon sx={{ color: 'white' }} />}
                                    />
                                </div>
                                <h3 className={styles.infoText} >4. Defina a aparência da página no fim do Quiz.</h3>
                            </div>
                            <div className={styles.infoLine}>
                                <div className={styles.stepInfoContainer} >
                                    <Step
                                        stepStyle={{
                                            width: '50px',
                                            height: '50px',
                                            background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                                            cursor: 'default',
                                        }}
                                        icon={<SettingsIcon sx={{ color: 'white' }} />}
                                    />
                                </div>
                                <h3 className={styles.infoText} >5. Escolha o nome do seu Quiz, descrição, e etc.</h3>
                            </div>
                        </div>
                    }
                    foot={
                        <Button
                            onClick={closeModal}
                            variant='contained'
                            color='success'
                        >
                            Entendi
                        </Button>
                    }
                />
            }
            <div id={styles.editorBody}>
                <div id={styles.middleContainer}>
                    <div id={styles.editorHead}>
                        <Stepper
                            currentStep={step}
                            handleChangeStep={handleChangeStep}
                            stepSize={{ width: '45px', height: '45px' }}
                            pathSize={{ width: '50px', height: '3px' }}
                            textColor={'white'}
                            stepStyle={{
                                background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                            }}
                            placeholderStepStyle={{
                                boxShadow: '2px 3px 8px 0px',
                            }}
                            placeholderPathStyle={{
                                boxShadow: '0px 5px 8px 0px',
                            }}
                            pathStyle={{
                                background: 'linear-gradient(165deg, rgb(0, 160, 220), rgb(49, 60, 78))',
                            }}
                            steps={[
                                <GroupAddIcon sx={{ color: 'white' }} />,
                                <PaletteIcon sx={{ color: 'white' }} />,
                                <QuizIcon sx={{ color: 'white' }} />,
                                <AssessmentIcon sx={{ color: 'white' }} />,
                                <SettingsIcon sx={{ color: 'white' }} />
                            ]}
                            labels={[
                                'Perfis',
                                'Design',
                                'Perguntas',
                                'Layout',
                                'Detalhes',
                            ]}
                        />
                    </div>
                    {stepDelay === 0 && quiz.results.length > 0 &&
                        <div
                            className={styles.middleAll}
                            id={styles.middleZero}
                        >
                            <FileInput
                                type='results'
                                quiz={quiz}
                                setQuiz={setQuiz}
                                currentSlide={currentSlide}
                                img={quiz.results[currentSlide].img}
                                width='500px'
                                height='300px'
                                INICIAL_IMG={INICIAL_IMG}
                                session={session}
                                step={step}
                            />
                            <CustomTextField
                                value={quiz.results[currentSlide].name}
                                label="Profile Name"
                                onChange={handleProfileNameChange}
                                variant='filled'
                                autoComplete='off'
                                spellCheck={false}
                            />
                        </div>
                    }
                    {stepDelay === 1 &&
                        <div
                            className={styles.middleAll}
                            id={styles.middleOne}
                        >
                            <div className={styles.questionsContainer}>
                                <QuestionField
                                    textColor={quiz.style.button.textColor}
                                    borderRadius={quiz.style.question.borderRadius}
                                    index={0}
                                    value='Sua Pergunta Aqui'
                                    variant={quiz.style.question.variant}
                                    colorValue={quiz.style.question.color}
                                    disabled
                                />
                            </div>
                            <div className={styles.optionsContainer}>
                                <div
                                    className={`
                                    ${styles.optionsRow} 
                                    ${quiz.style.button.template === 'custom'
                                            ? styles.rowExtraOptions
                                            : undefined}`
                                    }
                                >
                                    <OptionInput
                                        editMode
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={0}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 1'
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                    <OptionInput
                                        editMode
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={1}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 2'
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                </div>
                                <div
                                    className={`
                                    ${styles.optionsRow} 
                                    ${quiz.style.button.template === 'custom'
                                            ? styles.rowExtraOptions
                                            : undefined}`
                                    }
                                >
                                    <OptionInput
                                        editMode
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={2}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 3'
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                    <OptionInput
                                        editMode
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={3}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 4'
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                </div>
                                {quiz.style.button.template === 'custom' &&
                                    <div
                                        className={`
                                        ${styles.optionsRow} 
                                        ${quiz.style.button.template === 'custom'
                                                ? styles.rowExtraOptions
                                                : undefined}`
                                        }
                                    >
                                        <OptionInput
                                            editMode
                                            borderRadius={quiz.style.button.borderRadius}
                                            textColor={quiz.style.button.textColor}
                                            symbolColor={quiz.style.button.symbolColor}
                                            option={4}
                                            colorValue={module.value === 'monochrome'
                                                ? quiz.style.button.color
                                                : undefined
                                            }
                                            symbol={quiz.style.button.symbol}
                                            variant={quiz.style.button.variant}
                                            text='Opção 5'
                                            size='responsive'
                                            attSizeRef={attSizeRef}
                                        />
                                        <OptionInput
                                            editMode
                                            borderRadius={quiz.style.button.borderRadius}
                                            textColor={quiz.style.button.textColor}
                                            symbolColor={quiz.style.button.symbolColor}
                                            option={5}
                                            colorValue={module.value === 'monochrome'
                                                ? quiz.style.button.color
                                                : undefined
                                            }
                                            symbol={quiz.style.button.symbol}
                                            variant={quiz.style.button.variant}
                                            text='Opção 6'
                                            size='responsive'
                                            attSizeRef={attSizeRef}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {stepDelay === 2 && quiz.questions.length > 0 &&
                        <div
                            className={styles.middleAll}
                            id={styles.middleTwo}
                        >
                            <div className={styles.questionsContainer}>
                                <QuestionField
                                    editQuestionMode
                                    placeholder='Escreva Sua Pergunta Aqui'
                                    textColor={quiz.style.button.textColor}
                                    borderRadius={quiz.style.question.borderRadius}
                                    index={0}
                                    value={quiz.questions[currentSlide].content}
                                    variant={quiz.style.question.variant}
                                    colorValue={quiz.style.question.color}
                                    onChange={handleQuestionChange}
                                />
                            </div>
                            <div
                                className={styles.fileInputContainer}
                                style={{
                                    width: `${middleAllSize.height * 0.4}px`,
                                    height: `${middleAllSize.height * 0.24}px`,
                                }}
                            >
                                <FileInput
                                    type='questions'
                                    quiz={quiz}
                                    setQuiz={setQuiz}
                                    currentSlide={currentSlide}
                                    img={quiz.questions[currentSlide].img}
                                    INICIAL_IMG={INICIAL_IMG}
                                    session={session}
                                    changeScale
                                    step={step}
                                />
                            </div>
                            <div className={styles.editorOptionsContainer}>
                                <div className={`
                                ${styles.optionsRow} 
                                ${quiz.questions[currentSlide].haveExtraOptions
                                        ? styles.rowExtraOptions
                                        : undefined}`
                                }
                                >
                                    <OptionInput
                                        inputMode
                                        placeholder='Adicione a Opção 1'
                                        onChange={(e) => handleOptionTextChange(e, 0)}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={0}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text={quiz.questions[currentSlide].options[0].content}
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                    <OptionInput
                                        inputMode
                                        placeholder='Adicione a Opção 2'
                                        onChange={(e) => handleOptionTextChange(e, 1)}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={1}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text={quiz.questions[currentSlide].options[1].content}
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                </div>
                                <div className={`
                                ${styles.optionsRow} 
                                ${quiz.questions[currentSlide].haveExtraOptions
                                        ? styles.rowExtraOptions
                                        : undefined}`
                                }
                                >
                                    <OptionInput
                                        inputMode
                                        placeholder='Adicione a Opção 3 (Opcional)'
                                        onChange={(e) => handleOptionTextChange(e, 2)}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={2}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text={quiz.questions[currentSlide].options[2].content}
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                    <OptionInput
                                        inputMode
                                        placeholder='Adicione a Opção 4 (Opcional)'
                                        onChange={(e) => handleOptionTextChange(e, 3)}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={3}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text={quiz.questions[currentSlide].options[3].content}
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                </div>
                                {quiz.questions[currentSlide].haveExtraOptions &&
                                    <div className={`
                                    ${styles.optionsRow} 
                                    ${quiz.questions[currentSlide].haveExtraOptions
                                            ? styles.rowExtraOptions
                                            : undefined}`
                                    }
                                    >
                                        <OptionInput
                                            inputMode
                                            placeholder='Adicione a Opção 5 (Opcional)'
                                            onChange={(e) => handleOptionTextChange(e, 4)}
                                            borderRadius={quiz.style.button.borderRadius}
                                            textColor={quiz.style.button.textColor}
                                            symbolColor={quiz.style.button.symbolColor}
                                            option={4}
                                            colorValue={quiz.style.button.template === 'monochrome'
                                                ? quiz.style.button.color
                                                : undefined
                                            }
                                            symbol={quiz.style.button.symbol}
                                            variant={quiz.style.button.variant}
                                            text={quiz.questions[currentSlide].options[4].content}
                                            size='responsive'
                                            attSizeRef={attSizeRef}
                                        />
                                        <OptionInput
                                            inputMode
                                            placeholder='Adicione a Opção 6 (Opcional)'
                                            onChange={(e) => handleOptionTextChange(e, 5)}
                                            borderRadius={quiz.style.button.borderRadius}
                                            textColor={quiz.style.button.textColor}
                                            symbolColor={quiz.style.button.symbolColor}
                                            option={5}
                                            colorValue={quiz.style.button.template === 'monochrome'
                                                ? quiz.style.button.color
                                                : undefined
                                            }
                                            symbol={quiz.style.button.symbol}
                                            variant={quiz.style.button.variant}
                                            text={quiz.questions[currentSlide].options[5].content}
                                            size='responsive'
                                            attSizeRef={attSizeRef}
                                        />
                                    </div>
                                }
                            </div>
                            <Button
                                variant='contained'
                                className={styles.addExtraOptionsButton}
                                onClick={
                                    quiz.questions[currentSlide].haveExtraOptions
                                        ? () => removeExtraOptions(currentSlide)
                                        : () => addExtraOptions(currentSlide)
                                }
                            >
                                {
                                    quiz.questions[currentSlide].haveExtraOptions
                                        ? 'Remover Respostas Adicionais'
                                        : 'Adicionar Respostas Adicionais'
                                }
                            </Button>
                        </div>
                    }
                    {stepDelay === 4 &&
                        <div
                            className={styles.middleAll}
                            id={styles.middleFour}
                        >
                            <div
                                className={styles.finalContainer}
                            >
                                <TextField
                                    label="Nome do Quiz"
                                    value={quiz.name}
                                    onChange={(e) => handleChangeQuizField(e.target.value, 'name')}
                                    variant='outlined'
                                    size='small'
                                    autoComplete='off'
                                    spellCheck={false}

                                />
                                <TextField
                                    label="Descrição"
                                    variant='outlined'
                                    size='small'
                                    autoComplete='off'
                                    spellCheck={false}
                                />
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel size='small'>
                                        Categoria
                                    </InputLabel>
                                    <Select
                                        MenuProps={MenuProps}
                                        input={<OutlinedInput label="Categoria" />}
                                        value={quiz.category}
                                        onChange={(e) => handleChangeQuizField(e.target.value, 'category')}
                                        size='small'
                                        sx={{
                                            width: '100%',
                                        }}
                                    >
                                        {CATEGORIES.map((category, i) =>
                                            <MenuItem
                                                value={category.value}
                                                key={i}
                                            >
                                                {category.label}
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <Button
                                    variant='contained'
                                    onClick={createQuiz}
                                    disabled={disableCreateQuiz}
                                >
                                    {disableCreateQuiz ? 'Criando Quiz' : 'Criar Quiz'}
                                </Button>
                            </div>
                        </div>
                    }
                </div>
                <DragDropContext onDragEnd={stepDelay === 0 || stepDelay === 3 ? handleDragEndProfiles : handleDragEndQuestions}>
                    <div
                        id={styles.leftContainer}
                        style={{
                            left: stepDelay === 4
                                ? '-320px'
                                : '0px',
                        }}
                    >
                        <Droppable droppableId="slides">
                            {(provided, snapshot) => (
                                <div
                                    id={styles.slidesContainer}
                                    style={{
                                        transition: ANIMATION_COLUMNS,
                                        left: step !== stepDelay
                                            ? '-130%'
                                            : '0px',
                                    }}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {(stepDelay === 0 || stepDelay === 3) &&
                                        quiz.results.map((result, i) =>
                                            <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`${styles.slideContainer} ${currentSlide === i ? styles.currentSlide : undefined} ${notInDragNDropState ? styles.notInDragNDrop : undefined}`}
                                                        onClick={() => changeCurrentSlide(i)}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className={`${styles.buttonsContainer} ${currentSlide !== i ? styles.showOnHover : undefined}`}>
                                                            {stepDelay === 0 &&
                                                                <div className='flex end size100'>
                                                                    <IconButton onClick={(e) => handleDuplicateProfile(e, i)} sx={{ scale: '0.7', margin: '-4px' }}>
                                                                        <ContentCopyIcon />
                                                                    </IconButton>
                                                                    <IconButton onClick={(e) => handleDeleteProfile(e, result.id)} sx={{ scale: '0.7', margin: '-4px' }}>
                                                                        <DeleteForeverIcon sx={{ scale: '1.2' }} />
                                                                    </IconButton>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className={styles.slide}>
                                                            <h5>{i + 1}</h5>
                                                            <div className={styles.slideBoard} style={{ backgroundColor: result.color }}>
                                                                <div className={`${styles.slideImgContainer} ${result.img.content === '' ? styles.slideImgPlaceholder : undefined}`}>
                                                                    <img
                                                                        style={result.img.positionToFit === 'vertical' ? { height: 'auto', width: '100%' } : { height: '100%', width: 'auto' }}
                                                                        src={result.img.content}
                                                                    />
                                                                </div>
                                                                <div className={result.name !== '' ? styles.nameMiniContainer : undefined}>
                                                                    <h5>{result.name}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}
                                    {stepDelay === 1 &&
                                        DESIGN_EDIT_OPTIONS.map((module, i) =>
                                            <div
                                                className={`${styles.slideContainer} ${currentSlide === i ? styles.currentSlide : undefined} ${notInDragNDropState ? styles.notInDragNDrop : undefined}`}
                                                onClick={() => handleTemplateChange(i)}
                                                key={i}
                                            >
                                                <div className={`${styles.buttonsContainer} ${currentSlide !== i ? styles.showOnHover : undefined}`}>
                                                </div>
                                                <div className={styles.slide}>
                                                    <h5>{module.title}</h5>
                                                    <div className={styles.slideBoard} style={BACKGROUND_STYLES.get(quiz.style.background.type)}>
                                                        <div className={styles.miniQuestion}>
                                                            <QuestionField
                                                                index={1 + (i * 1)}
                                                                textColor={quiz.style.button.textColor}
                                                                borderRadius={quiz.style.question.borderRadius}
                                                                value='Sua Pergunta Aqui'
                                                                variant={quiz.style.question.variant}
                                                                colorValue={quiz.style.question.color}
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className={styles.optionsContainerSlide}>
                                                            <div
                                                                className={`
                                                                    ${styles.optionsRow} 
                                                                    ${styles.optionsRowSlide}
                                                                    ${module.value === 'custom'
                                                                        ? styles.rowExtraOptions
                                                                        : undefined
                                                                    }`
                                                                }
                                                            >
                                                                <OptionInput
                                                                    editMode
                                                                    borderRadius={quiz.style.button.borderRadius}
                                                                    textColor={quiz.style.button.textColor}
                                                                    symbolColor={quiz.style.button.symbolColor}
                                                                    option={0}
                                                                    colorValue={module.value === 'monochrome'
                                                                        ? quiz.style.button.color
                                                                        : undefined
                                                                    }
                                                                    symbol={quiz.style.button.symbol}
                                                                    variant={quiz.style.button.variant}
                                                                    text=''
                                                                    size='responsive'
                                                                />
                                                                <OptionInput
                                                                    editMode
                                                                    borderRadius={quiz.style.button.borderRadius}
                                                                    textColor={quiz.style.button.textColor}
                                                                    symbolColor={quiz.style.button.symbolColor}
                                                                    option={1}
                                                                    colorValue={module.value === 'monochrome'
                                                                        ? quiz.style.button.color
                                                                        : undefined
                                                                    }
                                                                    symbol={quiz.style.button.symbol}
                                                                    variant={quiz.style.button.variant}
                                                                    text=''
                                                                    size='responsive'
                                                                />
                                                            </div>
                                                            <div
                                                                className={`
                                                                    ${styles.optionsRow} 
                                                                    ${styles.optionsRowSlide}
                                                                    ${module.value === 'custom'
                                                                        ? styles.rowExtraOptions
                                                                        : undefined
                                                                    }`
                                                                }
                                                            >
                                                                <OptionInput
                                                                    editMode
                                                                    borderRadius={quiz.style.button.borderRadius}
                                                                    textColor={quiz.style.button.textColor}
                                                                    symbolColor={quiz.style.button.symbolColor}
                                                                    option={2}
                                                                    colorValue={module.value === 'monochrome'
                                                                        ? quiz.style.button.color
                                                                        : undefined
                                                                    }
                                                                    symbol={quiz.style.button.symbol}
                                                                    variant={quiz.style.button.variant}
                                                                    text=''
                                                                    size='responsive'
                                                                />
                                                                <OptionInput
                                                                    editMode
                                                                    borderRadius={quiz.style.button.borderRadius}
                                                                    textColor={quiz.style.button.textColor}
                                                                    symbolColor={quiz.style.button.symbolColor}
                                                                    option={3}
                                                                    colorValue={module.value === 'monochrome'
                                                                        ? quiz.style.button.color
                                                                        : undefined
                                                                    }
                                                                    symbol={quiz.style.button.symbol}
                                                                    variant={quiz.style.button.variant}
                                                                    text=''
                                                                    size='responsive'
                                                                />
                                                            </div>
                                                            {module.value === 'custom' &&
                                                                <div
                                                                    className={`
                                                                    ${styles.optionsRow} 
                                                                    ${styles.optionsRowSlide}
                                                                    ${module.value === 'custom'
                                                                            ? styles.rowExtraOptions
                                                                            : undefined
                                                                        }`
                                                                    }
                                                                >
                                                                    <OptionInput
                                                                        editMode
                                                                        borderRadius={quiz.style.button.borderRadius}
                                                                        textColor={quiz.style.button.textColor}
                                                                        symbolColor={quiz.style.button.symbolColor}
                                                                        option={4}
                                                                        colorValue={module.value === 'monochrome'
                                                                            ? quiz.style.button.color
                                                                            : undefined
                                                                        }
                                                                        symbol={quiz.style.button.symbol}
                                                                        variant={quiz.style.button.variant}
                                                                        text=''
                                                                        size='responsive'
                                                                    />
                                                                    <OptionInput
                                                                        editMode
                                                                        borderRadius={quiz.style.button.borderRadius}
                                                                        textColor={quiz.style.button.textColor}
                                                                        symbolColor={quiz.style.button.symbolColor}
                                                                        option={5}
                                                                        colorValue={module.value === 'monochrome'
                                                                            ? quiz.style.button.color
                                                                            : undefined
                                                                        }
                                                                        symbol={quiz.style.button.symbol}
                                                                        variant={quiz.style.button.variant}
                                                                        text=''
                                                                        size='responsive'
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {stepDelay === 2 &&
                                        quiz.questions.map((question, i) =>
                                            <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={`${styles.slideContainer} ${currentSlide === i ? styles.currentSlide : undefined} ${notInDragNDropState ? styles.notInDragNDrop : undefined}`}
                                                        onClick={() => changeCurrentSlide(i)}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className={`${styles.buttonsContainer} ${currentSlide !== i ? styles.showOnHover : undefined}`}>
                                                            <IconButton onClick={(e) => handleDuplicateQuestion(e, i)} aria-label="copy" sx={{ scale: '0.7', margin: '-4px' }}>
                                                                <ContentCopyIcon />
                                                            </IconButton>
                                                            <IconButton onClick={(e) => handleDeleteQuestion(e, i)} aria-label="delete" sx={{ scale: '0.7', margin: '-4px' }}>
                                                                <DeleteForeverIcon sx={{ scale: '1.2' }} />
                                                            </IconButton>
                                                        </div>
                                                        <div className={styles.slide}>
                                                            <h5>{i + 1} {QUESTIONS_TYPES.get(question.type)}</h5>
                                                            <div
                                                                className={styles.slideBoard}
                                                                style={BACKGROUND_STYLES.get(quiz.style.background.type)}
                                                            >
                                                                <div
                                                                    className={styles.miniQuestion}
                                                                    style={{
                                                                        transition: ANIMATION_COLUMNS,
                                                                        marginTop: question.img.content === ''
                                                                            ? '10%'
                                                                            : '0px'
                                                                    }}
                                                                >
                                                                    <QuestionField
                                                                        editQuestionMode
                                                                        textColor={quiz.style.button.textColor}
                                                                        value={question.content}
                                                                        borderRadius={quiz.style.question.borderRadius}
                                                                        index={1 + (i * 1)}
                                                                        variant={quiz.style.question.variant}
                                                                        colorValue={quiz.style.question.color}
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <motion.div
                                                                    className={`${styles.slideQuestionImg}`}
                                                                    initial={{
                                                                        height: question.img.content === ''
                                                                            ? '0px'
                                                                            : '30%'
                                                                    }}
                                                                    animate={{
                                                                        height: question.img.content === ''
                                                                            ? '0px'
                                                                            : '30%'
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        ease: ANIMATION_FIELDS
                                                                    }}
                                                                >
                                                                    <img
                                                                        style={question.img.positionToFit === 'vertical'
                                                                            ? { height: 'auto', width: '100%' }
                                                                            : { height: '100%', width: 'auto' }
                                                                        }
                                                                        src={question.img.content}
                                                                    />
                                                                </motion.div>
                                                                <div className={styles.optionsQuestionsSlide}>
                                                                    <div
                                                                        className={`
                                                                    ${styles.optionsRow} 
                                                                    ${styles.optionsRowSlide}
                                                                    ${question.haveExtraOptions
                                                                                ? styles.rowExtraOptions
                                                                                : undefined
                                                                            }`
                                                                        }
                                                                    >
                                                                        <OptionInput
                                                                            borderRadius={quiz.style.button.borderRadius}
                                                                            textColor={quiz.style.button.textColor}
                                                                            symbolColor={quiz.style.button.symbolColor}
                                                                            option={0}
                                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                                ? quiz.style.button.color
                                                                                : undefined
                                                                            }
                                                                            symbol={quiz.style.button.symbol}
                                                                            variant={quiz.style.button.variant}
                                                                            text={''}
                                                                            size='responsive'
                                                                            attSizeRef={attSizeRef}
                                                                        />
                                                                        <OptionInput
                                                                            borderRadius={quiz.style.button.borderRadius}
                                                                            textColor={quiz.style.button.textColor}
                                                                            symbolColor={quiz.style.button.symbolColor}
                                                                            option={1}
                                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                                ? quiz.style.button.color
                                                                                : undefined
                                                                            }
                                                                            symbol={quiz.style.button.symbol}
                                                                            variant={quiz.style.button.variant}
                                                                            text={''}
                                                                            size='responsive'
                                                                            attSizeRef={attSizeRef}
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className={`
                                                                    ${styles.optionsRow} 
                                                                    ${styles.optionsRowSlide}
                                                                    ${question.haveExtraOptions
                                                                                ? styles.rowExtraOptions
                                                                                : undefined
                                                                            }`
                                                                        }
                                                                    >
                                                                        <OptionInput
                                                                            borderRadius={quiz.style.button.borderRadius}
                                                                            textColor={quiz.style.button.textColor}
                                                                            symbolColor={quiz.style.button.symbolColor}
                                                                            option={2}
                                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                                ? quiz.style.button.color
                                                                                : undefined
                                                                            }
                                                                            symbol={quiz.style.button.symbol}
                                                                            variant={quiz.style.button.variant}
                                                                            text={''}
                                                                            size='responsive'
                                                                            attSizeRef={attSizeRef}
                                                                        />
                                                                        <OptionInput
                                                                            borderRadius={quiz.style.button.borderRadius}
                                                                            textColor={quiz.style.button.textColor}
                                                                            symbolColor={quiz.style.button.symbolColor}
                                                                            option={3}
                                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                                ? quiz.style.button.color
                                                                                : undefined
                                                                            }
                                                                            symbol={quiz.style.button.symbol}
                                                                            variant={quiz.style.button.variant}
                                                                            text={''}
                                                                            size='responsive'
                                                                            attSizeRef={attSizeRef}
                                                                        />
                                                                    </div>
                                                                    {question.haveExtraOptions &&
                                                                        <div
                                                                            className={`
                                                                    ${styles.optionsRow} 
                                                                    ${styles.optionsRowSlide}
                                                                    ${question.haveExtraOptions
                                                                                    ? styles.rowExtraOptions
                                                                                    : undefined
                                                                                }`
                                                                            }
                                                                        >
                                                                            <OptionInput
                                                                                borderRadius={quiz.style.button.borderRadius}
                                                                                textColor={quiz.style.button.textColor}
                                                                                symbolColor={quiz.style.button.symbolColor}
                                                                                option={4}
                                                                                colorValue={quiz.style.button.template === 'monochrome'
                                                                                    ? quiz.style.button.color
                                                                                    : undefined
                                                                                }
                                                                                symbol={quiz.style.button.symbol}
                                                                                variant={quiz.style.button.variant}
                                                                                text={''}
                                                                                size='responsive'
                                                                                attSizeRef={attSizeRef}
                                                                            />
                                                                            <OptionInput
                                                                                borderRadius={quiz.style.button.borderRadius}
                                                                                textColor={quiz.style.button.textColor}
                                                                                symbolColor={quiz.style.button.symbolColor}
                                                                                option={5}
                                                                                colorValue={quiz.style.button.template === 'monochrome'
                                                                                    ? quiz.style.button.color
                                                                                    : undefined
                                                                                }
                                                                                symbol={quiz.style.button.symbol}
                                                                                variant={quiz.style.button.variant}
                                                                                text={''}
                                                                                size='responsive'
                                                                                attSizeRef={attSizeRef}
                                                                            />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}
                                    {provided.placeholder}
                                    {stepDelay === 0 &&
                                        <Button
                                            id={styles.addProfileButton}
                                            onClick={handleAddProfile}
                                            variant='contained'
                                        >
                                            Adicionar Perfil
                                        </Button>
                                    }
                                    {stepDelay === 2 &&
                                        <Button
                                            id={styles.addQuestionButton}
                                            onClick={handleAddQuestion}
                                            variant='contained'
                                        >
                                            Adicionar Pergunta
                                        </Button>
                                    }
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>

                <div
                    id={styles.rightContainer}
                    style={{ right: stepDelay === 4 ? '-320px' : '0px' }}
                >
                    <div
                        className='flex relative start size100'
                        style={{
                            transition: ANIMATION_COLUMNS,
                            right: step !== stepDelay
                                ? '-130%'
                                : '0px',
                        }}
                    >
                        {stepDelay === 0 && quiz.results.length > 0 &&
                            <div className='flex start'>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>
                                        <PersonIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Perfil
                                        </h4>
                                    </div>
                                    <ColorInput
                                        onChange={handleProfileColor}
                                        value={quiz.results[currentSlide].color}
                                    />
                                </div>
                            </div>
                        }
                        {stepDelay === 1 && quiz.results.length > 0 &&
                            <div className='flex start'>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>
                                        <LiveHelpRoundedIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Pergunta
                                        </h4>
                                    </div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel size='small'>
                                            Tipo
                                        </InputLabel>
                                        <Select
                                            MenuProps={MenuProps}
                                            input={<OutlinedInput label="Tipo" />}
                                            value={quiz.style.question.variant}
                                            onChange={handleQuestionVariantChange}
                                            size='small'
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <MenuItem value={'text'}>Texto</MenuItem>
                                            <MenuItem value={'shadow'}>Sombra</MenuItem>
                                            <MenuItem value={'outlined'}>Contorno</MenuItem>
                                            <MenuItem value={'contained'}>Preenchido</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <ColorInput
                                        onChange={(e) => handleStyleColor(e, 'question', 'color')}
                                        value={quiz.style.question.color}
                                    />
                                    <div className='size100 flex'>
                                        <p className='size100 flex align-start' style={{ color: '#6c6e82', fontSize: '13px' }}>
                                            Borda
                                        </p>
                                        <Slider
                                            sx={{
                                                marginBottom: '-0.3rem'
                                            }}
                                            value={quiz.style.question.borderRadius}
                                            valueLabelDisplay="auto"
                                            onChange={handleQuestionBorder}
                                        />
                                    </div>
                                </div>
                                <div className={styles.divider}>
                                </div>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>
                                        <GamepadRoundedIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Botões
                                        </h4>
                                    </div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel size='small'>
                                            Tipo
                                        </InputLabel>
                                        <Select
                                            MenuProps={MenuProps}
                                            input={<OutlinedInput label="Tipo" />}
                                            value={quiz.style.button.variant}
                                            onChange={handleButtonVariantChange}
                                            size='small'
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <MenuItem value={'outlined'}>Contorno</MenuItem>
                                            <MenuItem value={'contained'}>Preenchido</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {quiz.style.button.template === 'monochrome' &&
                                        <ColorInput
                                            onChange={(e) => handleStyleColor(e, 'button', 'color')}
                                            value={quiz.style.button.color}
                                        />
                                    }
                                    <div className='size100 flex'>
                                        <p className='size100 flex align-start' style={{ color: '#6c6e82', fontSize: '13px' }}>
                                            Borda
                                        </p>
                                        <Slider
                                            sx={{
                                                marginBottom: '-0.3rem'
                                            }}
                                            value={quiz.style.button.borderRadius}
                                            valueLabelDisplay="auto"
                                            onChange={handleButtonBorder}
                                        />
                                    </div>
                                </div>
                                <div className={styles.divider}>
                                </div>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>
                                        <CategoryRoundedIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Símbolos
                                        </h4>
                                    </div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <InputLabel size='small'>
                                            Tipo
                                        </InputLabel>
                                        <Select
                                            MenuProps={MenuProps}
                                            input={<OutlinedInput label="Tipo" />}
                                            value={quiz.style.button.symbol}
                                            onChange={handleButtonSymbolChange}
                                            size='small'
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <MenuItem value={'none'}>Nenhum</MenuItem>
                                            <MenuItem value={'letters'}>Letras</MenuItem>
                                            <MenuItem value={'polygons'}>Formas</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <motion.div
                                        className='flex relative size100'
                                        initial={{
                                            marginBottom: quiz.style.button.symbol === 'none' || quiz.style.button.variant === 'outlined'
                                                ? '-48px'
                                                : '0.00001px'
                                        }}
                                        animate={{
                                            marginBottom: quiz.style.button.symbol === 'none' || quiz.style.button.variant === 'outlined'
                                                ? '-48px'
                                                : '0.00001px'
                                        }}
                                        transition={{
                                            delay: quiz.style.button.symbol === 'none'
                                                || quiz.style.button.variant === 'outlined'
                                                ? 0.15
                                                : 0,
                                            duration: 0.3,
                                            ease: ANIMATION_FIELDS
                                        }}
                                    >
                                        <ColorInput
                                            onChange={(e) => handleStyleColor(e, 'button', 'symbolColor')}
                                            value={quiz.style.button.symbolColor}
                                            initial={{
                                                right: quiz.style.button.symbol === 'none'
                                                    || quiz.style.button.variant === 'outlined'
                                                    ? '-150%'
                                                    : '0%',
                                            }}
                                            animate={{
                                                right: quiz.style.button.symbol === 'none'
                                                    || quiz.style.button.variant === 'outlined'
                                                    ? '-150%'
                                                    : '0%',
                                            }}
                                            transition={{
                                                delay: quiz.style.button.symbol === 'none'
                                                    || quiz.style.button.variant === 'outlined'
                                                    ? 0
                                                    : 0.15,
                                                duration: 0.3,
                                                ease: ANIMATION_FIELDS
                                            }}
                                        />
                                    </motion.div>
                                </div>
                                <div className='flex center'>
                                    <div className={styles.divider}>
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputTitle}>
                                            <PhotoSizeSelectActualRoundedIcon sx={{ color: '#1c222c' }} />
                                            <h4 className={styles.inputLabel}>
                                                Fundo
                                            </h4>
                                        </div>
                                        <FormControl sx={{ width: '100%' }}>
                                            <InputLabel size='small'>
                                                Tipo
                                            </InputLabel>
                                            <Select
                                                MenuProps={MenuProps}
                                                input={<OutlinedInput label="Tipo" />}
                                                value={quiz.style.background.type}
                                                onChange={handleBackgroundTypeChange}
                                                size='small'
                                                sx={{
                                                    width: '100%',
                                                }}
                                            >
                                                <MenuItem value={'solid'}>Sólido</MenuItem>
                                                <MenuItem value={'gradient'}>Degradê Linear</MenuItem>
                                                <MenuItem value={'radial'}>Degradê Radial</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {quiz.style.background.type === 'solid' &&
                                            <ColorInput
                                                onChange={(e) => handleStyleColor(e, 'background', 'color')}
                                                value={quiz.style.background.color}
                                                upPosition
                                            />
                                        }
                                        {(quiz.style.background.type === 'gradient' || quiz.style.background.type === 'radial') &&
                                            <div className='flex center' style={{ gap: '15px' }}>
                                                {quiz.style.background.gradientColors.map((color, i) =>
                                                    <div
                                                        className='flex row size100'
                                                        key={i}
                                                    >
                                                        <ColorInput
                                                            onChange={(e) => handleStyleGradientColors(e, 'background', 'gradientColors', i)}
                                                            value={color}
                                                            customLabel={`Cor ${i + 1}`}
                                                            upPosition
                                                        />
                                                        {i > 1 &&
                                                            <div style={{ backgroundColor: 'transparent', width: 'auto' }}>
                                                                <IconButton onClick={() => deleteGradientColor(i)} sx={{ scale: '0.7', margin: '-4px' }}>
                                                                    <DeleteForeverIcon />
                                                                </IconButton>
                                                            </div>
                                                        }
                                                    </div>
                                                )}
                                                {quiz.style.background.gradientColors.length < 6 &&
                                                    <Button
                                                        onClick={addGradientColor}
                                                        variant='contained'
                                                        size='small'
                                                    >
                                                        Adicionar Cor
                                                    </Button>
                                                }
                                                <div className='size100 flex'>
                                                    <p className='size100 flex align-start' style={{ color: '#6c6e82', fontSize: '13px' }}>
                                                        Porcentagem
                                                    </p>
                                                    <Slider
                                                        value={quiz.style.background.gradientPercentages}
                                                        valueLabelDisplay="auto"
                                                        onChange={handleBackgroundPercentage}
                                                        track={false}
                                                    />
                                                </div>
                                                {quiz.style.background.type === 'gradient' &&
                                                    <div className='size100 flex'>
                                                        <p className='size100 flex align-start' style={{ color: '#6c6e82', fontSize: '13px' }}>
                                                            Ângulo
                                                        </p>
                                                        <Slider
                                                            value={quiz.style.background.angle}
                                                            max={360}
                                                            valueLabelDisplay="auto"
                                                            onChange={handleBackgroundAngle}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                                {(quiz.style.button.variant === 'contained' || quiz.style.question.variant === 'contained') &&
                                    <div className='flex center'>
                                        <div className={styles.divider}>
                                        </div>
                                        <div className={styles.inputContainer}>
                                            <div className={styles.inputTitle}>
                                                <TextFieldsRoundedIcon sx={{ color: '#1c222c' }} />
                                                <h4 className={styles.inputLabel}>
                                                    Texto
                                                </h4>
                                            </div>
                                            <ColorInput
                                                onChange={(e) => handleStyleColor(e, 'button', 'textColor')}
                                                value={quiz.style.button.textColor}
                                                upPosition
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                        {stepDelay === 2 && quiz.questions.length > 0 &&
                            <div className='flex size100 start'>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>
                                        <ContactSupportRoundedIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Tipo da Pergunta
                                        </h4>
                                    </div>
                                    <FormControl sx={{ width: '100%' }}>
                                        <Select
                                            MenuProps={MenuProps}
                                            input={<OutlinedInput />}
                                            value={quiz.questions[currentSlide].type}
                                            onChange={e => handleChangeQuestionField(e.target.value, 'type')}
                                            size='small'
                                            sx={{
                                                width: '100%',
                                            }}
                                        >
                                            <MenuItem value={'standard'}>Padrão</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className={styles.divider} style={{ width: '110%', marginBottom: '-0.2rem', marginTop: '0.5rem' }}>
                                    </div>
                                </div>
                                <div className={styles.inputContainer}>
                                    <div className='flex row start size100'
                                        style={{
                                            gap: '3%',
                                        }}
                                    >
                                        <TimerRoundedIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Timer
                                        </h4>
                                        <Switch
                                            checked={quiz.questions[currentSlide].haveTimer}
                                            onChange={handleSwitchTimer}
                                            sx={{
                                                marginLeft: '-3%',
                                                marginBottom: '-3px',
                                            }}
                                        />
                                    </div>
                                    <motion.div
                                        className='flex relative fillWidth'
                                        initial={{
                                            marginBottom: quiz.questions[currentSlide].haveTimer
                                                ? '0.00001px'
                                                : '-62px',
                                        }}
                                        animate={{
                                            marginBottom: quiz.questions[currentSlide].haveTimer
                                                ? '0.00001px'
                                                : '-62px',
                                        }}
                                        transition={{
                                            delay: quiz.questions[currentSlide].haveTimer
                                                ? 0
                                                : 0.15,
                                            duration: 0.3,
                                            ease: ANIMATION_FIELDS
                                        }}
                                    >
                                        <motion.div
                                            className='flex relative size100'
                                            initial={{
                                                right: quiz.questions[currentSlide].haveTimer
                                                    ? '0%'
                                                    : '-150%',
                                            }}
                                            animate={{
                                                right: quiz.questions[currentSlide].haveTimer
                                                    ? '0%'
                                                    : '-150%',
                                            }}
                                            transition={{
                                                delay: quiz.questions[currentSlide].haveTimer
                                                    ? 0.15
                                                    : 0,
                                                duration: 0.3,
                                                ease: ANIMATION_FIELDS
                                            }}
                                        >
                                            <FormControl sx={{
                                                m: 1,
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <FormControl sx={{ width: '48.5%' }}>
                                                    <InputLabel size='small'>
                                                        Minutos
                                                    </InputLabel>
                                                    <Select
                                                        MenuProps={MenuProps}
                                                        input={<OutlinedInput label="Minutos" />}
                                                        value={quiz.questions[currentSlide].timerMinutes}
                                                        onChange={e => handleChangeQuestionField(e.target.value, 'timerMinutes')}
                                                        size='small'
                                                        sx={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        <MenuItem value={0}>00</MenuItem>
                                                        <MenuItem value={1}>01</MenuItem>
                                                        <MenuItem value={2}>02</MenuItem>
                                                        <MenuItem value={3}>03</MenuItem>
                                                        <MenuItem value={4}>04</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <p style={{ width: '3%' }}>
                                                    :
                                                </p>
                                                <FormControl sx={{ width: '48.5%' }}>
                                                    <InputLabel size='small'>
                                                        Segundos
                                                    </InputLabel>
                                                    <Select
                                                        MenuProps={MenuProps}
                                                        input={<OutlinedInput label="Segundos" />}
                                                        value={quiz.questions[currentSlide].timerSeconds}
                                                        onChange={e => handleChangeQuestionField(e.target.value, 'timerSeconds')}
                                                        size='small'
                                                        sx={{
                                                            width: '100%',
                                                        }}
                                                    >
                                                        <MenuItem value={0}>00</MenuItem>
                                                        <MenuItem value={5}>05</MenuItem>
                                                        <MenuItem value={10}>10</MenuItem>
                                                        <MenuItem value={15}>15</MenuItem>
                                                        <MenuItem value={20}>20</MenuItem>
                                                        <MenuItem value={25}>25</MenuItem>
                                                        <MenuItem value={30}>30</MenuItem>
                                                        <MenuItem value={35}>35</MenuItem>
                                                        <MenuItem value={40}>40</MenuItem>
                                                        <MenuItem value={45}>45</MenuItem>
                                                        <MenuItem value={50}>50</MenuItem>
                                                        <MenuItem value={55}>55</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </FormControl>
                                        </motion.div>
                                    </motion.div>
                                </div>
                                {quiz.questions[currentSlide].options.map((option, i) =>
                                    i < 4 || quiz.questions[currentSlide].haveExtraOptions
                                        ? <div
                                            key={i}
                                            className={styles.inputContainer}
                                        >
                                            <div className={styles.divider} style={{ width: '110%' }}>
                                            </div>
                                            <div className={styles.inputTitle} style={{ gap: '4%' }}>
                                                {ICONS_POLYGONS[i]}
                                                <h4 className={styles.inputLabel}>
                                                    {`Pontos (Opção ${i + 1})`}
                                                </h4>
                                            </div>
                                            {option.actions.map((action, j) =>
                                                <div
                                                    className={styles.actionsContainer}
                                                    key={j}
                                                >
                                                    <div className='flex row start alignStart fillWidth'>
                                                        <FormControl sx={{ width: '80%' }}>
                                                            <InputLabel size='small'>
                                                                Perfil
                                                            </InputLabel>
                                                            <Select
                                                                MenuProps={MenuProps}
                                                                input={<OutlinedInput label="Perfil" />}
                                                                placeholder='Escolha um Perfil'
                                                                value={action.profile}
                                                                onChange={e => handleChangeOptionActionProfile(e.target.value, currentSlide, i, j)}
                                                                size='small'
                                                                sx={{
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                {quiz.results.map((result, i) =>
                                                                    result.name !== ''
                                                                        ? <MenuItem
                                                                            className={styles.menuItemColorful}
                                                                            style={{
                                                                                backgroundColor: result.color.concat('b0')
                                                                            }}
                                                                            key={i}
                                                                            value={result.id}
                                                                        >
                                                                            {result.name}
                                                                        </MenuItem>
                                                                        : undefined
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                        <FormControl sx={{ width: '20%' }}>
                                                            <IconButton
                                                                onClick={() => handleDeleteAction(currentSlide, i, j)}
                                                                sx={{ scale: '0.7', margin: '-4px' }}
                                                            >
                                                                <DeleteForeverIcon sx={{ scale: '1.2' }} />
                                                            </IconButton>
                                                        </FormControl>
                                                    </div>
                                                    <motion.div
                                                        className='flex relative fillWidth'
                                                        initial={{
                                                            marginBottom: action.profile !== ''
                                                                ? '0.00001px'
                                                                : '-50px',
                                                        }}
                                                        animate={{
                                                            marginBottom: action.profile !== ''
                                                                ? '0.00001px'
                                                                : '-50px',
                                                        }}
                                                        transition={{
                                                            delay: action.profile !== ''
                                                                ? 0
                                                                : 0.15,
                                                            duration: 0.3,
                                                            ease: ANIMATION_FIELDS
                                                        }}
                                                    >
                                                        <motion.div
                                                            className='flex align-start relative fillWidth'
                                                            initial={{
                                                                right: action.profile !== ''
                                                                    ? '0%'
                                                                    : '-150%',
                                                            }}
                                                            animate={{
                                                                right: action.profile !== ''
                                                                    ? '0%'
                                                                    : '-150%',
                                                            }}
                                                            transition={{
                                                                delay: action.profile !== ''
                                                                    ? 0.15
                                                                    : 0,
                                                                duration: 0.3,
                                                                ease: ANIMATION_FIELDS
                                                            }}
                                                        >
                                                            <FormControl sx={{
                                                                width: '80%',
                                                                display: 'flex',
                                                            }}>
                                                                <InputLabel size='small'>
                                                                    Pontos
                                                                </InputLabel>
                                                                <Select
                                                                    MenuProps={MenuProps}
                                                                    input={<OutlinedInput label="Pontos" />}
                                                                    value={action.points}
                                                                    onChange={e => handleChangeOptionActionField(e.target.value, 'points', currentSlide, i, j)}
                                                                    size='small'
                                                                    sx={{
                                                                        width: '100%',
                                                                    }}
                                                                >
                                                                    <MenuItem value={1}>1 Ponto</MenuItem>
                                                                    <MenuItem value={2}>2 Pontos</MenuItem>
                                                                    <MenuItem value={3}>3 Pontos</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </motion.div>
                                                    </motion.div>
                                                </div>
                                            )}
                                            {option.actions.length < quiz.results.length &&
                                                <Button
                                                    size='small'
                                                    variant='text'
                                                    onClick={() => addAction(currentSlide, i)}
                                                    sx={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    Adicionar Perfil
                                                </Button>
                                            }
                                        </div>
                                        : undefined
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </motion.div >
    )
}