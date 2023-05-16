import styles from '../styles/lobby.module.css'
import Router from "next/router";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Select from "react-select";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { validateCodeCharacters, validateCodeLength, containsAccents } from "../../utils/validations";
import { showInfoToast } from "../../utils/toasts";
import { motion } from "framer-motion"
import Switch, { SwitchProps } from '@mui/material/Switch';
import { TextField, Button } from '@mui/material';

let socket;

export default function Lobby(props) {
    const { session } = props
    const [newRoom, setNewRoom] = useState({ name: '', code: '', private: false, control: false, password: '', state: 'disable' })
    const [searchCode, setSearchCode] = useState('')
    const [newCode, setNewCode] = useState('')
    const [requestState, setRequestState] = useState('denied')
    const [showModal, setShowModal] = useState(false)
    const [showModalOpacity, setShowModalOpacity] = useState(false)
    const [disableCreateNewRoom, setDisableCreateNewRoom] = useState(false)
    const [passwordInputOpen, setPasswordInputOpen] = useState(false)

    useEffect(() => {
        if (!newRoom.owner) {
            setNewRoom(prev => { return { ...prev, owner: session.user.email } })
        }
    }, [session])

    function handleCodeChange(event) {
        setSearchCode(event.target.value)
    }

    function handleNewCodeChange(event) {
        setNewCode(event.target.value)
        setNewRoom(prev => { return { ...prev, name: event.target.value, code: convertToCode(event.target.value) } })
    }

    function handleNewPasswordChange(event) {
        setNewRoom(prev => { return { ...prev, password: event.target.value } })
    }

    function handleNewIsPrivate(event) {
        const { checked } = event.target
        if (checked)
            setPasswordInputOpen(prev => !prev)
        else {
            setNewRoom(prev => { return { ...prev, password: '' } })
            setTimeout(() => setPasswordInputOpen(prev => !prev), 1000)
        }
        setNewRoom(prev => { return { ...prev, private: checked } })
    }

    function handleNewControl(event) {
        const { checked } = event.target
        setNewRoom(prev => { return { ...prev, control: checked } })
    }

    async function handleSubmitCode(event) {
        if ((event._reactName === 'onClick' || event.key === 'Enter') && searchCode !== '') {
            const options = {
                method: 'GET',
                headers: { "code": convertToCode(searchCode) },
            };
            await fetch("/api/rooms", options)
                .then(response => response.json())
                .then(response => {
                    if (response.room)
                        Router.push(`/quiz?code=${convertToCode(searchCode)}`)
                    else
                        showInfoToast("Esta sala não existe.", 3000)
                })
                .catch(err => console.error(err));
        }
    }

    function convertToCode(string) {
        return string.toLowerCase().split('').map(ele => ele === ' ' ? '-' : ele).join('')
    }

    function openModal() {
        setShowModalOpacity(true)
        setShowModal(true)
    }

    function handleQuizSelectorChange(event) {
        setNewRoom(prev => { return { ...prev, quizInfo: session.user.quizzesInfos[event.value] } })
    }

    function closeModal() {
        setShowModalOpacity(false)
        setTimeout(() => {
            setPasswordInputOpen(false)
            setShowModal(false)
            setNewRoom(prev => { return { ...prev, password: '', code: '', name: '', private: false, control: false } })
            delete newRoom.quizInfo
        }, 300)
    }

    async function createNewRoom() {
        if (!newRoom.quizInfo) {
            showInfoToast("Nenhum Quiz Selecitonado.", 3000)
            return
        }
        if (containsAccents(newRoom.code)) {
            showInfoToast("O nome não pode conter acentos.", 3000)
            return
        }
        if (!validateCodeCharacters(newRoom.code)) {
            showInfoToast("O nome deve conter apenas letras, números, espaços ou hífens.", 5000)
            return
        }
        if (!validateCodeLength(newRoom.code)) {
            showInfoToast("O nome deve conter ao menos 3 letras ou números.", 5000)
            return
        }
        if ((newRoom.private && newRoom.password.length < 3)) {
            showInfoToast("A senha deve conter ao menos 3 caracteres.", 5000)
            return
        }
        setDisableCreateNewRoom(true)
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        };

        await fetch('/api/rooms', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
        Router.push(`/room?code=${newRoom.code}`)
    }

    return (
        <div>
            <main className={styles.main}>
                <TextField
                    value={searchCode}
                    onChange={handleCodeChange}
                    onKeyDown={handleSubmitCode}
                    id="outlined-basic"
                    label="Nome da Sala"
                    variant='outlined'
                    autoComplete='off'
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#e5e5e5',
                            },
                            '&:hover fieldset': {
                                borderColor: '#ffffff',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#e5e5e5',
                        },
                        '&:hover .MuiInputLabel-root': {
                            color: '#ffffff',
                        },
                        '& .MuiInputLabel-shrink': {
                            color: '#009fda',
                        },
                    }}
                />
                <Button variant="outlined" onClick={handleSubmitCode} disabled={searchCode === ''} >
                    Entrar
                </Button>
                <Button variant="outlined" onClick={openModal}>
                    Criar Sala
                </Button>
                {showModal && <Modal height={'60%'} width={'30%'} minHeight={'350px'} minWidth={'250px'} closeModal={closeModal} showModalOpacity={showModalOpacity}
                    head={
                        <div className={styles.headContainer}>
                            <h2>Criar Sala</h2>
                        </div>
                    }
                    body={
                        <div className={styles.bodyContainer}>
                            <TextField value={newRoom.name} onChange={handleNewCodeChange} id="outlined-basic" label="Nome" variant='outlined' size='small' autoComplete='off' /* inputProps={{ style: { height: "50px", width: '50px' } }} */ />
                            <div className={styles.privateAndInput}>
                                <FormControlLabel
                                    control={<Switch />}
                                    label="Private:"
                                    labelPlacement="start"
                                    onChange={handleNewIsPrivate}
                                    checked={newRoom.private}
                                />
                                <motion.div
                                    className={styles.password}
                                    onChange={handleNewPasswordChange}
                                    value={newRoom.password}
                                    placeholder="Senha"
                                    initial={{ width: '0%' }}
                                    animate={newRoom.private ? { width: '100%' } : { width: '0%' }}
                                    transition={{ times: [0, 1], duration: 1, ease: newRoom.private ? [.62, -0.18, .32, 1.8] : [.52, .03, .24, 1.06] }}
                                >
                                    <TextField value={newRoom.password} id="outlined-basic" label="Senha" variant='outlined' size='small' autoComplete='off' />
                                </motion.div>
                            </div>
                            <FormControlLabel onChange={handleNewControl} checked={newRoom.control} control={<Switch />} label="Controlar Perguntas:" labelPlacement="start" />
                            <Select
                                placeholder='Quiz'
                                className={styles.selectQuiz}
                                onChange={handleQuizSelectorChange}
                                options={session.user.quizzesInfos.map((quiz, i) => { return { value: i, label: quiz.name } })}
                            />
                            {/* <input className={styles.nameInput} onChange={handleNewCodeChange} value={newRoom.name} placeholder="Nome" />
                            <div className={styles.privateAndInput}>
                                <div className={styles.privateContainer}>
                                    <label>Private: </label>
                                    <input type="checkbox" onChange={handleNewIsPrivate} checked={newRoom.private} />
                                </div>
                                {passwordInputOpen &&
                                    <motion.input
                                        className={styles.password}
                                        onChange={handleNewPasswordChange}
                                        value={newRoom.password}
                                        placeholder="Senha"
                                        animate={newRoom.private ? { width: ['0%', '65%', '65%'], height: ['0%', '0%', '100%'] } : { width: ['65%', '65%', '0%'], height: ['100%', '0%', '0%'] }}
                                        transition={{ times: [0, 0.5, 1], duration: 1, ease: newRoom.private ? [.62, -0.18, .32, 1.8] : [.52, .03, .24, 1.06] }}
                                    />
                                }
                            </div>
                            <div className={styles.controlContainer}>
                                <label>Controlar Perguntas: </label>
                                <input type="checkbox" onChange={handleNewControl} checked={newRoom.control} />
                            </div>
                            <Select
                                placeholder='Quiz'
                                className={styles.selectQuiz}
                                onChange={handleQuizSelectorChange}
                                options={session.user.quizzesInfos.map((quiz, i) => { return { value: i, label: quiz.name } })}
                            /> */}
                        </div>
                    }
                    foot={
                        <div className={styles.footContainer}>
                            <Button onClick={closeModal} variant="contained" color="error">
                                Cancelar
                            </Button>
                            <Button onClick={createNewRoom} variant="contained" color="success">
                                Criar
                            </Button>
                            {/* <button onClick={closeModal}>Cancelar</button>
                            <button onClick={createNewRoom} disabled={disableCreateNewRoom} >{disableCreateNewRoom ? "Criando" : "Criar"}</button> */}
                        </div>
                    }
                />}
            </main>
        </div>
    )
}