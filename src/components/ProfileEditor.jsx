import styles from '../styles/components/ProfileEditor.module.css'
import {
    Button,
    TextField,
    IconButton,
    Step,
    StepLabel,
    Stepper
} from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { styled } from '@mui/material/styles'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import React from 'react';
import { HexColorPicker } from "react-colorful"
import { motion } from "framer-motion"

// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useState } from 'react'
import MiniSlide from './MiniSlide'
import { showInfoToast } from '../../utils/toasts'
import FileInput from './FileInput'


export default function ProfileEditor(props) {
    const { quiz, setQuiz } = props

    const [step, setStep] = useState(0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [imgState, setImgState] = useState(false)

    function handleAddQuestion() {
        setQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, INICIAL_QUIZ.questions[0]]
        }))
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

    function handleDragEndProfiles(res) {
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

    function ColorlibStepIcon(props) {
        const { active, completed, className } = props;

        const icons = {
            1: <GroupAddIcon />,
            2: <QuizIcon />,
            3: <AssessmentIcon />,
            4: <SettingsIcon />,
        }

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        )
    }

    function handleAddProfile() {
        if (quiz.results.length >= 16)
            showInfoToast("Número máximo de 16 perfis atingido.", 3000)
        else {
            setQuiz(prev => ({
                ...prev,
                results: [
                    ...prev.results,
                    {
                        name: '',
                        color: '#ffffff',
                        img: { content: '', name: '', type: '' }
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

    const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        ...(ownerState.active && {
            backgroundImage:
                'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        }),
        ...(ownerState.completed && {
            backgroundImage:
                'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        }),
        transition: 'all ease 2s',
    }))

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage:
                    'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor:
                theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderRadius: 1,
        },
    }))

    function handleChangeStep(newStep) {
        setCurrentSlide(0)
        setStep(newStep)
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

    function handleColorChange(event) {
        setQuiz(prev => ({
            ...prev,
            results: prev.results.map((result, i) =>
                currentSlide === i
                    ? { ...result, color: event }
                    : result)
        }))
    }

    return (
        <motion.div
            id={styles.editorContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [.62, -0.18, .32, 1.17] }}
        >
            <div id={styles.editorHead}>
                <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
                    <Step>
                        <StepLabel onClick={() => handleChangeStep(0)} StepIconComponent={ColorlibStepIcon} >{'Passo 1'}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel onClick={() => handleChangeStep(1)} StepIconComponent={ColorlibStepIcon} >{'Passo 2'}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel onClick={() => handleChangeStep(2)} StepIconComponent={ColorlibStepIcon} >{'Passo 3'}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel onClick={() => handleChangeStep(3)} StepIconComponent={ColorlibStepIcon} >{'Passo 4'}</StepLabel>
                    </Step>
                </Stepper>
            </div>
            <div id={styles.editorBody}>
                <DragDropContext onDragEnd={step === 0 || step === 2 ? handleDragEndProfiles : handleDragEndQuestions}>
                    <div id={styles.leftContainer}>
                        <Droppable droppableId="slides">
                            {(provided, snapshot) => (
                                <div
                                    id={styles.slidesContainer}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {step === 0 && quiz.results.map((result, i) =>
                                        <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`${currentSlide === i && styles.currentSlide} ${styles.slideContainer}`}
                                                    onClick={() => changeCurrentSlide(i)}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className={`${styles.buttonsContainer} ${currentSlide !== i && styles.showOnHover}`}                                                    >
                                                        <IconButton onClick={(e) => handleDuplicateProfile(e, i)} aria-label="copy" sx={{ scale: '0.7', margin: '-4px' }}>
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                        <IconButton onClick={(e) => handleDeleteProfile(e, i)} aria-label="delete" sx={{ scale: '0.7', margin: '-4px' }}>
                                                            <DeleteForeverIcon sx={{ scale: '1.2' }} />
                                                        </IconButton>
                                                    </div>
                                                    <div className={styles.slide}>
                                                        <h4>{i + 1}</h4>
                                                        <div className={styles.slideBoard} style={{ backgroundColor: quiz.results[i].color }}>
                                                            {quiz.results[i].img.content !== '' &&
                                                            <div className={styles.slideImgContainer}>
                                                                <img
                                                                    style={imgState ? { height: 'auto', width: '100%' } : { height: '100%', width: 'auto' }}
                                                                    src={quiz.results[i].img.content}
                                                                />
                                                            </div>
                                                            }
                                                            <h2>{result.name}</h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    )}
                                    {step === 1 && quiz.questions.map((question, i) =>
                                        <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`${currentSlide === i && styles.currentSlide} ${styles.slideContainer}`}
                                                    onClick={() => changeCurrentSlide(i)}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className={styles.buttonsContainer} >
                                                        <IconButton onClick={(e) => handleDuplicateSlide(e, i)} size='small' aria-label="copy">
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                        <IconButton onClick={(e) => handleDeleteSlide(e, i)} size='small' aria-label="delete">
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
                                    {step === 2 && quiz.results.map((result, i) =>
                                        <Draggable key={i} draggableId={`slide-${i}`} index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    className={styles.slideContainer}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                </div>
                                            )}
                                        </Draggable>
                                    )}
                                    {provided.placeholder}
                                    {step === 0 &&
                                        <Button id={styles.addProfileButton} onClick={handleAddProfile} variant='contained' >Adicionar Perfil</Button>
                                    }
                                    {step === 1 &&
                                        <Button id={styles.addQuestionButton} onClick={handleAddQuestion} variant='contained' >Adicionar Pergunta</Button>
                                    }
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
                <div id={styles.middleContainer}>
                    {step === 0 && quiz.results.length > 0 &&
                        <div className='flex-start'>
                            <FileInput
                                quiz={quiz}
                                setQuiz={setQuiz}
                                currentSlide={currentSlide}
                                imgState={imgState}
                                setImgState={setImgState}
                            />
                            <TextField
                                value={quiz.results[currentSlide].name}
                                label="Profile Name"
                                onChange={handleProfileNameChange}
                                variant='filled'
                                autoComplete='off'
                            />
                        </div>
                    }
                    {step === 1 &&
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
                <div id={styles.rightContainer}>
                    {step === 0 && quiz.results.length > 0 &&
                        <div className='flex-start' style={{ paddingTop: '20px' }} >
                            <HexColorPicker
                                id={styles.colorPicker}
                                onChange={handleColorChange}
                                color={quiz.results[currentSlide].color}
                            />
                            <TextField
                                value={quiz.results[currentSlide].color}
                                variant='standard'
                                sx={{ width: '60%', height: '200px' }}
                                autoComplete='off'
                            />
                        </div>
                    }
                </div>
            </div>
        </motion.div>
    )
}