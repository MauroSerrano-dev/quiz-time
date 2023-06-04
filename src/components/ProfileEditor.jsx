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

// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useState } from 'react'

export default function ProfileEditor(props) {
    const {
        quiz,
        setQuiz,
        handleQuestionChange,
        handleOptionChange,
        handleDuplicateSlide,
        handleDeleteSlide,
        handleAddQuestion
    } = props

    const [step, setStep] = useState(0)


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
        setStep(newStep)
    }

    return (
        <div id={styles.editorContainer}>
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
                <DragDropContext onDragEnd={handleDragEnd}>
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
                                                    className={styles.slideContainer}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                </div>
                                            )}
                                        </Draggable>
                                    )}
                                    {step === 1 && quiz.questions.map((question, i) =>
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
                                    <Button id={styles.addQuestionButton} onClick={handleAddQuestion} variant='contained' >Adicionar Pergunta</Button>
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
                <div id={styles.middleContainer}>
                    <TextField onChange={handleQuestionChange} variant='filled' autoComplete='off' />
                </div>
                <div id={styles.rightContainer}>
                </div>
            </div>
        </div>
    )
}