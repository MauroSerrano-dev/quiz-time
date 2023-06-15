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
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

const DESIGN_EDIT_OPTIONS = [
    { title: 'Monocromático', value: 'monochrome' },
    { title: 'Colorido', value: 'colorful' },
    { title: 'Pro', value: 'custom' },
]

const INICIAL_GRADIENT_PERCENTAGES = new Map([
    [2, [0, 100]],
    [3, [0, 50, 100]],
    [4, [0, 33, 67, 100]],
    [5, [0, 25, 50, 75, 100]],
    [6, [0, 20, 40, 60, 80, 100]],
])

export default function ProfileEditor(props) {
    const { quiz, setQuiz, INICIAL_QUIZ } = props

    const [step, setStep] = useState(0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [notInDragNDropState, setNotInDragNDropState] = useState(true)
    const [showModal, setShowModal] = useState(true)
    const [showModalOpacity, setShowModalOpacity] = useState(true)
    const [attSizeRef, setAttSizeRef] = useState(false)
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
            questions: [...prev.questions, INICIAL_QUIZ.questions[0]]
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
        setQuiz((prev, i) => ({
            ...prev,
            questions: prev.questions.slice(0, index + 1)
                .concat(prev.questions[index])
                .concat(prev.questions.slice(index + 1, prev.questions.length))
        }))
        if (index < currentSlide)
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

    function handleAddProfile() {
        if (quiz.results.length >= 16)
            showErrorToast("Número máximo de 16 perfis atingido.", 3000)
        else {
            setQuiz(prev => ({
                ...prev,
                results: [
                    ...prev.results,
                    {
                        name: '',
                        color: '#ffffff',
                        img: { content: '', name: '', type: '', positionToFit: '' }
                    }]
            }))
            setCurrentSlide(quiz.results.length)
        }
    }

    function handleDeleteProfile(event, index) {
        event.stopPropagation()
        if (currentSlide === quiz.results.length - 1)
            setCurrentSlide(quiz.results.length - 2)
        setQuiz(prev => ({ ...prev, results: prev.results.filter((result, i) => index !== i) }))
    }

    function handleDuplicateProfile(event, index) {
        event.stopPropagation()
        setQuiz((prev, i) => ({
            ...prev,
            results: prev.results.slice(0, index + 1)
                .concat(prev.results[index])
                .concat(prev.results.slice(index + 1, prev.results.length))

        }))
        if (index < currentSlide)
            setCurrentSlide(prev => prev + 1)
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
        setShowModalOpacity(false)
        setTimeout(() => {
            setShowModal(false)
        }, 300)
    }

    function handleChangeStep(newStep) {
        if (newStep === 1)
            setCurrentSlide(quiz.style.button.template === 'monochrome'
                ? 0
                : (quiz.style.button.template === 'colorful' ? 1 : 2)
            )
        else
            setCurrentSlide(0)
        setStep(newStep)
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

    function handleChangeExtraOptions() {
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                currentSlide === i
                    ? { ...question, haveExtraOptions: !prev.questions[currentSlide].haveExtraOptions }
                    : question
            )
        }))
        setAttSizeRef(prev => !prev)
    }

    function handleOptionTextChange(event, optionIndex) {
        console.log(event.target.value)
        setQuiz(prev => ({
            ...prev,
            questions: prev.questions.map((question, i) =>
                currentSlide === i
                    ? {
                        ...question,
                        options: prev.questions[i].options.map((option, j) =>
                            j === optionIndex
                                ? { ...option, content: event.target.value }
                                : option
                        )
                    }
                    : question
            )
        }))
    }

    return (
        <motion.div
            id={styles.editorContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}
            style={BACKGROUND_STYLES.get(quiz.style.background.type)}
        >
            {showModal &&
                <Modal
                    width={'550px'}
                    height={'450px'}
                    widthMobile={'350px'}
                    heightMobile={'450px'}
                    widthSmall={'250px'}
                    heightSmall={'450px'}
                    closeModal={closeModal}
                    showModalOpacity={showModalOpacity}
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
                    {step === 0 && quiz.results.length > 0 &&
                        <div
                            className={styles.middleAll}
                            id={styles.middleZero}
                        >
                            <FileInput
                                index={0}
                                type='results'
                                quiz={quiz}
                                setQuiz={setQuiz}
                                currentSlide={currentSlide}
                                img={quiz.results[currentSlide].img}
                                width='500px'
                                height='300px'
                            />
                            <CustomTextField
                                value={quiz.results[currentSlide].name}
                                label="Profile Name"
                                onChange={handleProfileNameChange}
                                variant='filled'
                                autoComplete='off'
                            />
                        </div>
                    }
                    {step === 1 &&
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
                                        className={styles.optionInput}
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
                                        className={styles.optionInput}
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
                                        className={styles.optionInput}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={2}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        } symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 3'
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                    <OptionInput
                                        editMode
                                        className={styles.optionInput}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={3}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        } symbol={quiz.style.button.symbol}
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
                                            className={styles.optionInput}
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
                                            className={styles.optionInput}
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
                    {step === 2 && quiz.questions.length > 0 &&
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
                                    index={0}
                                    type='questions'
                                    quiz={quiz}
                                    setQuiz={setQuiz}
                                    currentSlide={currentSlide}
                                    img={quiz.questions[currentSlide].img}
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
                                        placeholder='Adicione a Opção 1'
                                        onChange={(e) => handleOptionTextChange(e, 0)}
                                        className={styles.optionInput}
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
                                        placeholder='Adicione a Opção 2'
                                        onChange={(e) => handleOptionTextChange(e, 1)}
                                        className={styles.optionInput}
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
                                        placeholder='Adicione a Opção 3 (Opcional)'
                                        onChange={(e) => handleOptionTextChange(e, 2)}
                                        className={styles.optionInput}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={2}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        } symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text={quiz.questions[currentSlide].options[2].content}
                                        size='responsive'
                                        attSizeRef={attSizeRef}
                                    />
                                    <OptionInput
                                        placeholder='Adicione a Opção 4 (Opcional)'
                                        onChange={(e) => handleOptionTextChange(e, 3)}
                                        className={styles.optionInput}
                                        borderRadius={quiz.style.button.borderRadius}
                                        textColor={quiz.style.button.textColor}
                                        symbolColor={quiz.style.button.symbolColor}
                                        option={3}
                                        colorValue={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : undefined
                                        } symbol={quiz.style.button.symbol}
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
                                            placeholder='Adicione a Opção 5 (Opcional)'
                                            onChange={(e) => handleOptionTextChange(e, 4)}
                                            className={styles.optionInput}
                                            borderRadius={quiz.style.button.borderRadius}
                                            textColor={quiz.style.button.textColor}
                                            symbolColor={quiz.style.button.symbolColor}
                                            option={4}
                                            colorValue={quiz.style.button.template === 'monochrome'
                                                ? quiz.style.button.color
                                                : undefined
                                            } symbol={quiz.style.button.symbol}
                                            variant={quiz.style.button.variant}
                                            text={quiz.questions[currentSlide].options[4].content}
                                            size='responsive'
                                            attSizeRef={attSizeRef}
                                        />
                                        <OptionInput
                                            placeholder='Adicione a Opção 6 (Opcional)'
                                            onChange={(e) => handleOptionTextChange(e, 5)}
                                            className={styles.optionInput}
                                            borderRadius={quiz.style.button.borderRadius}
                                            textColor={quiz.style.button.textColor}
                                            symbolColor={quiz.style.button.symbolColor}
                                            option={5}
                                            colorValue={quiz.style.button.template === 'monochrome'
                                                ? quiz.style.button.color
                                                : undefined
                                            } symbol={quiz.style.button.symbol}
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
                                onClick={handleChangeExtraOptions}
                            >
                                {
                                    quiz.questions[currentSlide].haveExtraOptions
                                        ? 'Remover Respostas Adicionais'
                                        : 'Adicionar Respostas Adicionais'
                                }
                            </Button>
                        </div>
                    }
                </div>
                <DragDropContext onDragEnd={step === 0 || step === 3 ? handleDragEndProfiles : handleDragEndQuestions}>
                    <div
                        id={styles.leftContainer}
                        style={{ width: step === 4 ? '0px' : undefined }}
                    >
                        <Droppable droppableId="slides">
                            {(provided, snapshot) => (
                                <div
                                    id={styles.slidesContainer}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {(step === 0 || step === 3) &&
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
                                                            {step === 0 &&
                                                                <div className='flex end size100'>
                                                                    <IconButton onClick={(e) => handleDuplicateProfile(e, i)} aria-label="copy" sx={{ scale: '0.7', margin: '-4px' }}>
                                                                        <ContentCopyIcon />
                                                                    </IconButton>
                                                                    <IconButton onClick={(e) => handleDeleteProfile(e, i)} aria-label="delete" sx={{ scale: '0.7', margin: '-4px' }}>
                                                                        <DeleteForeverIcon sx={{ scale: '1.2' }} />
                                                                    </IconButton>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className={styles.slide}>
                                                            <h4>{i + 1}</h4>
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
                                    {step === 1 &&
                                        DESIGN_EDIT_OPTIONS.map((module, i) =>
                                            <div
                                                className={`${styles.slideContainer} ${currentSlide === i ? styles.currentSlide : undefined} ${notInDragNDropState ? styles.notInDragNDrop : undefined}`}
                                                onClick={() => handleTemplateChange(i)}
                                                key={i}
                                            >
                                                <div className={`${styles.buttonsContainer} ${currentSlide !== i ? styles.showOnHover : undefined}`}>
                                                </div>
                                                <div className={styles.slide}>
                                                    <h4>{module.title}</h4>
                                                    <div className={styles.slideBoard} style={BACKGROUND_STYLES.get(quiz.style.background.type)}>
                                                        <div className={styles.miniQuestion}>
                                                            <QuestionField
                                                                slideMode
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
                                                                    slideMode
                                                                    editMode
                                                                    className={styles.optionInput}
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
                                                                    sixOptions={module.value === 'custom'}
                                                                />
                                                                <OptionInput
                                                                    slideMode
                                                                    editMode
                                                                    className={styles.optionInput}
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
                                                                    sixOptions={module.value === 'custom'}
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
                                                                    slideMode
                                                                    editMode
                                                                    className={styles.optionInput}
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
                                                                    sixOptions={module.value === 'custom'}
                                                                />
                                                                <OptionInput
                                                                    slideMode
                                                                    editMode
                                                                    className={styles.optionInput}
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
                                                                    sixOptions={module.value === 'custom'}
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
                                                                        slideMode
                                                                        editMode
                                                                        className={styles.optionInput}
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
                                                                        sixOptions={module.value === 'custom'}
                                                                    />
                                                                    <OptionInput
                                                                        slideMode
                                                                        editMode
                                                                        className={styles.optionInput}
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
                                                                        sixOptions={module.value === 'custom'}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {(step === 2) &&
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
                                                            <h4>{i + 1}</h4>
                                                            <div className={styles.slideBoard} style={BACKGROUND_STYLES.get(quiz.style.background.type)}>
                                                                <div className={styles.miniQuestion}>
                                                                    <QuestionField
                                                                        slideMode
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
                                                                <div className={styles.optionsContainerSlide}>
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
                                                                            slideMode
                                                                            className={styles.optionInput}
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
                                                                            sixOptions={question.haveExtraOptions}
                                                                            attSizeRef={attSizeRef}
                                                                        />
                                                                        <OptionInput
                                                                            slideMode
                                                                            className={styles.optionInput}
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
                                                                            sixOptions={question.haveExtraOptions}
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
                                                                            slideMode
                                                                            className={styles.optionInput}
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
                                                                            sixOptions={question.haveExtraOptions}
                                                                            attSizeRef={attSizeRef}
                                                                        />
                                                                        <OptionInput
                                                                            slideMode
                                                                            className={styles.optionInput}
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
                                                                            sixOptions={question.haveExtraOptions}
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
                                                                                slideMode
                                                                                className={styles.optionInput}
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
                                                                                sixOptions={question.haveExtraOptions}
                                                                                attSizeRef={attSizeRef}
                                                                            />
                                                                            <OptionInput
                                                                                slideMode
                                                                                className={styles.optionInput}
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
                                                                                sixOptions={question.haveExtraOptions}
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
                                    {step === 0 &&
                                        <Button id={styles.addProfileButton} onClick={handleAddProfile} variant='contained' >Adicionar Perfil</Button>
                                    }
                                    {step === 2 &&
                                        <Button id={styles.addQuestionButton} onClick={handleAddQuestion} variant='contained' >Adicionar Pergunta</Button>
                                    }
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>

                <div
                    id={styles.rightContainer}
                    style={{ width: step === 4 ? '0px' : undefined }}
                >
                    {step === 0 && quiz.results.length > 0 &&
                        <div className='flex start' style={{ paddingTop: '15px' }} >
                            <div className={styles.inputContainer}>
                                <div className='flex row start size100' style={{ gap: '3%' }}>
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
                    {step === 1 && quiz.results.length > 0 &&
                        <div className='flex start' style={{ paddingTop: '15px' }}>
                            <div className={styles.inputContainer}>
                                <div className='flex row start size100' style={{ gap: '3%' }}>
                                    <LiveHelpRoundedIcon sx={{ color: '#1c222c' }} />
                                    <h4 className={styles.inputLabel}>
                                        Pergunta
                                    </h4>
                                </div>
                                <FormControl sx={{ m: 1, width: '100%' }}>
                                    <InputLabel>
                                        Tipo
                                    </InputLabel>
                                    <Select
                                        input={<OutlinedInput label="Tipo" />}
                                        value={quiz.style.question.variant}
                                        onChange={handleQuestionVariantChange}
                                        MenuProps={MenuProps}
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
                                        value={quiz.style.question.borderRadius}
                                        valueLabelDisplay="auto"
                                        onChange={handleQuestionBorder}
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.divider}
                                style={{
                                    backgroundColor: 'black',
                                    opacity: 0.5,

                                }}
                            >
                            </div>
                            <div className={styles.inputContainer}>
                                <div className='flex row start size100' style={{ gap: '3%' }}>
                                    <GamepadRoundedIcon sx={{ color: '#1c222c' }} />
                                    <h4 className={styles.inputLabel}>
                                        Botões
                                    </h4>
                                </div>
                                <FormControl sx={{ m: 1, width: '100%' }}>
                                    <InputLabel>
                                        Tipo
                                    </InputLabel>
                                    <Select
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
                                        value={quiz.style.button.borderRadius}
                                        valueLabelDisplay="auto"
                                        onChange={handleButtonBorder}
                                    />
                                </div>
                            </div>
                            <div
                                className={styles.divider}
                                style={{
                                    backgroundColor: 'black',
                                    opacity: 0.5,

                                }}
                            >
                            </div>
                            <div className={styles.inputContainer}>
                                <div className='flex row start size100' style={{ gap: '3%' }}>
                                    <CategoryRoundedIcon sx={{ color: '#1c222c' }} />
                                    <h4 className={styles.inputLabel}>
                                        Símbolos
                                    </h4>
                                </div>
                                <FormControl sx={{ m: 1, width: '100%' }}>
                                    <InputLabel>
                                        Tipo
                                    </InputLabel>
                                    <Select
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
                                {quiz.style.button.variant === 'contained' &&
                                    <ColorInput
                                        onChange={(e) => handleStyleColor(e, 'button', 'symbolColor')}
                                        value={quiz.style.button.symbolColor}
                                    />
                                }
                            </div>
                            <div className='flex center size100'>
                                <div
                                    className={styles.divider}
                                    style={{
                                        backgroundColor: 'black',
                                        opacity: 0.5,

                                    }}
                                >
                                </div>
                                <div className={styles.inputContainer}>
                                    <div className='flex row start size100' style={{ gap: '3%' }}>
                                        <PhotoSizeSelectActualRoundedIcon sx={{ color: '#1c222c' }} />
                                        <h4 className={styles.inputLabel}>
                                            Fundo
                                        </h4>
                                    </div>
                                    <FormControl sx={{ m: 1, width: '100%' }}>
                                        <InputLabel>
                                            Tipo
                                        </InputLabel>
                                        <Select
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
                                <div className='flex center size100'>
                                    <div
                                        className={styles.divider}
                                        style={{
                                            backgroundColor: 'black',
                                            opacity: 0.5,
                                        }}
                                    >
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className='flex row start size100' style={{ gap: '3%' }}>
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
                </div>
            </div>
        </motion.div >
    )
}