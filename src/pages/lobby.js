import styles from '../styles/lobby.module.css'
import Router from "next/router";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Select from "react-select";
import { validateCodeCharacters, validateCodeLength, containsAccents } from "../../utils/validations";
import { showInfoToast } from "../../utils/toasts";
import { motion } from "framer-motion"

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
        if (session && !newRoom.owner) {
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
            <main>
                {showModal && <Modal height={'30%'} width={'25%'} minHeight={'350px'} minWidth={'250px'} closeModal={closeModal} showModalOpacity={showModalOpacity}
                    head={
                        <div className={styles.headContainer}>
                            <h2>Criar Sala</h2>
                        </div>
                    }
                    body={
                        <div className={styles.bodyContainer}>
                            <input className={styles.nameInput} onChange={handleNewCodeChange} value={newRoom.name} placeholder="Nome" />
                            <div className={styles.privateAndInput}>
                                <div className={styles.labelCheckbox}>
                                    <label>Private: </label>
                                    <input type="checkbox" onChange={handleNewIsPrivate} checked={newRoom.private} />
                                </div>
                                <div className={styles.labelCheckbox}>
                                    <label>Controlar Perguntas: </label>
                                    <input type="checkbox" onChange={handleNewControl} checked={newRoom.control} />
                                </div>
                                {passwordInputOpen &&
                                    <motion.input
                                        className={styles.password}
                                        onChange={handleNewPasswordChange}
                                        value={newRoom.password}
                                        placeholder="Senha"
                                        animate={newRoom.private ? { width: ['0%', '65%', '65%'], height: ['0%', '0%', '100%'], marginLeft: ['0%', '1%', '5%'] } : { width: ['65%', '65%', '0%'], height: ['100%', '0%', '0%'], marginLeft: ['5%', '1%', '0%'] }}
                                        transition={{ times: [0, 0.5, 1], duration: 1, ease: newRoom.private ? [.62, -0.18, .32, 1.17] : [.52, .03, .24, 1.06] }}
                                    />
                                }
                            </div>
                            <Select
                                placeholder='Quiz'
                                className={styles.selectQuiz}
                                onChange={handleQuizSelectorChange}
                                options={session.user.quizzesInfos.map((quiz, i) => { return { value: i, label: quiz.name } })}
                            />
                        </div>
                    }
                    foot={
                        <div className={styles.footContainer}>
                            <button onClick={closeModal}>Cancelar</button>
                            <button onClick={createNewRoom} disabled={disableCreateNewRoom} >{disableCreateNewRoom ? "Criando" : "Criar"}</button>
                        </div>
                    }
                />}
                <input onChange={handleCodeChange} onKeyDown={handleSubmitCode} value={searchCode} />
                <button onClick={handleSubmitCode} disabled={searchCode === ''} >Entrar</button>
                <button onClick={openModal}>Criar Sala</button>
            </main>
        </div>
    )
}