import styles from '../styles/lobby.module.css'
import Router from "next/router";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { validateCodeCharacters, validateCodeLength, containsAccents } from "../../utils/validations";
import { showInfoToast } from "../../utils/toasts";
import { motion } from "framer-motion"
import Switch from '@mui/material/Switch';
import { TextField, Button, Select, FormControlLabel, MenuItem, OutlinedInput, InputLabel, FormControl, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingButton from '@mui/lab/LoadingButton';

const INICIAL_ROOM = {
    name: '',
    code: '',
    private: false,
    control: false,
    password: '',
    state: 'disable',
    quizInfo: { name: '', purchaseDate: '', type: '' },
    currentQuestion: 0, players: []
}

export default function Lobby(props) {
    const { session } = props
    const [newRoom, setNewRoom] = useState(INICIAL_ROOM)
    const [searchCode, setSearchCode] = useState('')
    const [newCode, setNewCode] = useState('')
    const [requestState, setRequestState] = useState('denied')
    const [showModal, setShowModal] = useState(false)
    const [showModalOpacity, setShowModalOpacity] = useState(false)
    const [disableCreateNewRoom, setDisableCreateNewRoom] = useState(false)
    const [passwordInputOpen, setPasswordInputOpen] = useState(false)
    const [firstClickPrivite, setFirstClickPrivite] = useState(false)

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
        setFirstClickPrivite(true)
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
        setNewRoom(prev => { return { ...prev, quizInfo: session.user.quizzesInfos[event.target.value] } })
    }

    function closeModal() {
        setFirstClickPrivite(false)
        setShowModalOpacity(false)
        setTimeout(() => {
            setPasswordInputOpen(false)
            setShowModal(false)
            setNewRoom(INICIAL_ROOM)
        }, 300)
    }

    async function createNewRoom() {
        if (newRoom.quizInfo.name === '') {
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
            body: JSON.stringify({ ...newRoom, owner: session.user.email })
        }

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
                            <FormControl sx={{ height: '15%', width: '80%' }}>
                                <TextField value={newRoom.name} onChange={handleNewCodeChange} id="outlined-basic" label="Nome" variant='outlined' size='small' autoComplete='off' />
                            </FormControl>
                            <FormControl sx={{ height: '15%', width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
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
                                    initial={{ width: '0%', pointerEvents: 'none', opacity: 0 }}
                                    animate={newRoom.private ? { width: '100%', opacity: [0, 1, 1], pointerEvents: 'auto' } : { width: '0%', opacity: firstClickPrivite ? [1, 1, 0] : [0, 0, 0], pointerEvents: 'none' }}
                                    transition={{ times: [0, 0.8, 1], duration: 1, ease: newRoom.private ? [.62, -0.18, .32, 1.8] : [.52, .03, .24, 1.06] }}
                                >
                                    <FormControl sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                        <TextField value={newRoom.password} id="outlined-basic" label="Senha" variant='outlined' size='small' autoComplete='off' />
                                    </FormControl>
                                </motion.div>
                            </FormControl>
                            <FormControlLabel onChange={handleNewControl} checked={newRoom.control} control={<Switch />} label="Controlar Perguntas:" labelPlacement="start" />
                            <FormControl sx={{ width: '80%' }}>
                                <InputLabel size='small' id="select-label">Quiz</InputLabel>
                                <Select
                                    labelId="select-label"
                                    id="select"
                                    name={newRoom.quizInfo.name}
                                    value={session.user.quizzesInfos.reduce((acc, item, i) => item.name === newRoom.quizInfo.name && item.type === newRoom.quizInfo.type ? i : '', '')}
                                    onChange={handleQuizSelectorChange}
                                    input={<OutlinedInput label="Quiz" />}
                                    size='small'
                                >
                                    {session.user.quizzesInfos.map((quiz, i) => (
                                        <MenuItem
                                            key={`Quiz: ${i}`}
                                            name={quiz.name}
                                            value={i}
                                        >
                                            {quiz.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    }
                    foot={
                        <div className={styles.footContainer}>
                            <Button
                                onClick={closeModal}
                                variant="contained"
                                color="error"
                                sx={{ width: '30%', height: '55%' }}
                            >
                                Cancelar
                            </Button>
                            <LoadingButton
                                onClick={createNewRoom}
                                loading={disableCreateNewRoom}
                                loadingPosition={disableCreateNewRoom ? 'end' : 'center'}
                                color="success"
                                variant="contained"
                                endIcon={disableCreateNewRoom && <AddCircleOutlineIcon />}
                                sx={{ width: '30%', height: '55%' }}
                            >
                                {disableCreateNewRoom ? 'Criando' : 'Criar'}
                            </LoadingButton>
                        </div>
                    }
                />}
            </main>
        </div>
    )
}