import styles from '../styles/components/ProfileEditor.module.css'
import {
    Button,
    TextField,
    IconButton,
    Select,
    MenuItem
} from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import React from 'react';
import { HexColorPicker } from "react-colorful"
import { motion } from "framer-motion"
import { useState } from 'react'
import { showErrorToast } from '../../utils/toasts'
import FileInput from './FileInput'
import Stepper from './Stepper'
import Modal from './Modal'
import Step from './Step';

// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaletteIcon from '@mui/icons-material/Palette';
import OptionInput from './OptionInput';
import { CustomTextField } from '../../utils/mui';
import QuestionField from './QuestionField';

const DESIGN_EDIT_OPTIONS = [
    { title: 'Monocromático', value: 'monochrome' },
    { title: 'Colorido', value: 'colorful' },
]

export default function ProfileEditor(props) {
    const { quiz, setQuiz, INICIAL_QUIZ } = props

    const [step, setStep] = useState(0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [notInDragNDropState, setNotInDragNDropState] = useState(true)
    const [showModal, setShowModal] = useState(true)
    const [showModalOpacity, setShowModalOpacity] = useState(true)

    function handleAddQuestion() {
        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, INICIAL_QUIZ.questions[0]]
        }))
    }

    function handleDeleteQuestion(event, index) {
        event.stopPropagation()
        setQuiz((prev, i) => ({
            ...prev,
            questions: prev.questions.filter((question, i) => i != index)
        }))
    }

    function handleDuplicateQuestion(event, index) {
        event.stopPropagation()
        setQuiz((prev, i) => ({
            ...prev,
            questions: prev.questions.slice(0, index + 1)
                .concat(prev.questions[index])
                .concat(prev.questions.slice(index + 1, prev.questions.length))

        }))
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
        const [reorderedQuestion] = questions.splice(res.source.index, 1)
        questions.splice(res.destination.index, 0, reorderedQuestion)

        setQuiz(prev => ({
            ...prev,
            questions,
        }))
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
    }

    function changeCurrentSlide(index) {
        setCurrentSlide(index)
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
                    ? { ...result, color: typeof event === 'string' ? event : event.target.value }
                    : result)
        }))
    }

    function handleButtonColor(event) {
        setQuiz(prev => ({
            ...prev,
            style: {
                ...prev.style,
                button: {
                    ...prev.style.button,
                    color: typeof event === 'string' ? event : event.target.value
                }
            }
        }))
    }

    function isValidHexColor(string) {
        const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3,4})$/;
        return regex.test(string)
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
                : 1
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
                    template: index === 0 ? 'monochrome' : 'colorful'
                }
            }
        }))
    }

    return (
        <motion.div
            id={styles.editorContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}
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
                <div
                    id={styles.middleContainer}
                >
                    <div id={styles.editorHead}>
                        <Stepper
                            currentStep={step}
                            handleChangeStep={handleChangeStep}
                            stepSize={{ width: '50px', height: '50px' }}
                            pathSize={{ width: '70px', height: '3px' }}
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
                        <div className='flex-start'>
                            <FileInput
                                quiz={quiz}
                                setQuiz={setQuiz}
                                currentSlide={currentSlide}
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
                        <div className={styles.middleOne}>
                            <QuestionField

                            />
                            <div className={styles.optionsContainer}>
                                <div className={styles.optionsRow}>
                                    <OptionInput
                                        index={0}
                                        color={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : '#237e0b'
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 1'
                                        size='responsive'
                                    />
                                    <OptionInput
                                        index={1}
                                        color={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : '#d01937'
                                        }
                                        symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 2'
                                        size='responsive'
                                    />
                                </div>
                                <div className={styles.optionsRow}>
                                    <OptionInput
                                        index={2}
                                        color={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : '#e7b509'
                                        } symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 3'
                                        size='responsive'
                                    />
                                    <OptionInput
                                        index={3}
                                        color={quiz.style.button.template === 'monochrome'
                                            ? quiz.style.button.color
                                            : '#1260be'
                                        } symbol={quiz.style.button.symbol}
                                        variant={quiz.style.button.variant}
                                        text='Opção 4'
                                        size='responsive'
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    {step === 2 && quiz.questions.length > 0 &&
                        <div>
                            <TextField
                                value={quiz.questions[currentSlide].content}
                                label="Question"
                                onChange={handleQuestionChange}
                                variant='filled'
                                autoComplete='off'
                            />
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
                                    {(step === 0 || step === 3) && quiz.results.map((result, i) =>
                                        <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`${styles.slideContainer} ${currentSlide === i ? styles.currentSlide : undefined} ${notInDragNDropState ? styles.notInDragNDrop : undefined}`}
                                                    onClick={() => changeCurrentSlide(i)}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className={`${styles.buttonsContainer} ${currentSlide !== i ? styles.showOnHover : undefined}`}                                                    >
                                                        <IconButton onClick={(e) => handleDuplicateProfile(e, i)} aria-label="copy" sx={{ scale: '0.7', margin: '-4px' }}>
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                        <IconButton onClick={(e) => handleDeleteProfile(e, i)} aria-label="delete" sx={{ scale: '0.7', margin: '-4px' }}>
                                                            <DeleteForeverIcon sx={{ scale: '1.2' }} />
                                                        </IconButton>
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
                                    {step === 1 && DESIGN_EDIT_OPTIONS.map((module, i) =>
                                        <div
                                            className={`${styles.slideContainer} ${currentSlide === i ? styles.currentSlide : undefined} ${notInDragNDropState ? styles.notInDragNDrop : undefined}`}
                                            onClick={() => handleTemplateChange(i)}
                                            key={i}
                                        >
                                            <div className={`${styles.buttonsContainer} ${currentSlide !== i ? styles.showOnHover : undefined}`}                                                    >
                                            </div>
                                            <div className={styles.slide}>
                                                <h4>{module.title}</h4>
                                                <div className={styles.slideBoard} style={{ backgroundColor: 'white' }}>
                                                    <div className={styles.optionsContainerSlide}>
                                                        <div className={styles.optionsRowSlide}>
                                                            <OptionInput
                                                                index={4 + (i * 4)}
                                                                color={module.value === 'monochrome'
                                                                    ? quiz.style.button.color
                                                                    : '#237e0b'
                                                                }
                                                                symbol={quiz.style.button.symbol}
                                                                variant={quiz.style.button.variant}
                                                                text='Opção 1'
                                                                size='responsive'
                                                            />
                                                            <OptionInput
                                                                index={5 + (i * 4)}
                                                                color={module.value === 'monochrome'
                                                                    ? quiz.style.button.color
                                                                    : '#d01937'
                                                                }
                                                                symbol={quiz.style.button.symbol}
                                                                variant={quiz.style.button.variant}
                                                                text='Opção 2'
                                                                size='responsive'
                                                            />
                                                        </div>
                                                        <div className={styles.optionsRowSlide}>
                                                            <OptionInput
                                                                index={6 + (i * 4)}
                                                                color={module.value === 'monochrome'
                                                                    ? quiz.style.button.color
                                                                    : '#e7b509'
                                                                } symbol={quiz.style.button.symbol}
                                                                variant={quiz.style.button.variant}
                                                                text='Opção 3'
                                                                size='responsive'
                                                            />
                                                            <OptionInput
                                                                index={7 + (i * 4)}
                                                                color={module.value === 'monochrome'
                                                                    ? quiz.style.button.color
                                                                    : '#1260be'
                                                                } symbol={quiz.style.button.symbol}
                                                                variant={quiz.style.button.variant}
                                                                text='Opção 4'
                                                                size='responsive'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {step === 2 && quiz.questions.map((question, i) =>
                                        <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`${currentSlide === i ? styles.currentSlide : undefined} ${styles.slideContainer}`}
                                                    onClick={() => changeCurrentSlide(i)}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className={styles.buttonsContainer} >
                                                        <IconButton onClick={(e) => handleDuplicateQuestion(e, i)} size='small' aria-label="copy">
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                        <IconButton onClick={(e) => handleDeleteQuestion(e, i)} size='small' aria-label="delete">
                                                            <DeleteForeverIcon />
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
                        <div className='flex-start' style={{ paddingTop: '20px' }} >
                            <HexColorPicker
                                id={styles.colorPicker}
                                onChange={handleProfileColor}
                                color={quiz.results[currentSlide].color}
                            />
                            <TextField
                                value={quiz.results[currentSlide].color}
                                onChange={handleProfileColor}
                                variant='standard'
                                sx={{ width: '60%', height: '200px' }}
                                autoComplete='off'
                            />
                        </div>
                    }
                    {step === 1 && quiz.results.length > 0 &&
                        <div className='flex-start' style={{ paddingTop: '20px' }} >
                            <HexColorPicker
                                id={styles.colorPicker}
                                onChange={handleButtonColor}
                                color={quiz.style.button.color}
                            />
                            <TextField
                                value={quiz.style.button.color}
                                onChange={handleButtonColor}
                                variant='standard'
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '60%',
                                    height: '60px'
                                }}
                                autoComplete='off'
                            />
                            <div className={styles.inputContainer}>
                                <h4 className={styles.inputLabel}>
                                    Estilo do Botão
                                </h4>
                                <Select
                                    value={quiz.style.button.variant}
                                    onChange={handleButtonVariantChange}
                                    sx={{
                                        width: '100%',
                                        height: '35px'
                                    }}
                                >
                                    <MenuItem value={'contained'}>Contained</MenuItem>
                                    <MenuItem value={'outlined'}>Outlined</MenuItem>
                                </Select>
                            </div>
                            <div className={styles.inputContainer}>
                                <h4 className={styles.inputLabel}>
                                    Símbolo
                                </h4>
                                <Select
                                    value={quiz.style.button.symbol}
                                    onChange={handleButtonSymbolChange}
                                    sx={{
                                        width: '100%',
                                        height: '35px'
                                    }}
                                >
                                    <MenuItem value={'none'}>Nenhum</MenuItem>
                                    <MenuItem value={'letters'}>Letras</MenuItem>
                                    <MenuItem value={'polygons'}>Polígonos</MenuItem>
                                </Select>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </motion.div>
    )
}