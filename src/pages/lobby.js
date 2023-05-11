import Router from "next/router";
import { useEffect, useState } from "react";
import styles from '../styles/lobby.module.css'
import Modal from "../components/Modal";
import Select from "react-select";
import { validateCodeCharacters, validateCodeLength } from "../../utils/validations";
import 'react-toastify/dist/ReactToastify.css';
import { showInfoToast } from "../../utils/toasts";

let socket;

export default function Lobby(props) {
    const { session } = props
    const [newRoom, setNewRoom] = useState({ name: '', code: '', private: false, password: '' })
    const [searchCode, setSearchCode] = useState('')
    const [newCode, setNewCode] = useState('')
    const [requestState, setRequestState] = useState('denied')
    const [showModal, setShowModal] = useState(false)
    const [showModalOpacity, setShowModalOpacity] = useState(false)
    const [disableCreateNewRoom, setDisableCreateNewRoom] = useState(false)

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
        if (!event.target.checked)
            setNewRoom(prev => { return { ...prev, password: '' } })
        setNewRoom(prev => { return { ...prev, private: event.target.checked } })
    }

    async function handleSubmitCode() {
        const options = {
            method: 'GET',
            headers: { "code": convertToCode(searchCode) },
        };
        await fetch("/api/rooms", options)
            .then(response => response.json())
            .then(response => {
                if (response.room)
                    Router.push(`/room?code=${convertToCode(searchCode)}`)
                else
                    showInfoToast("Esta sala não existe.", 3000)
            })
            .catch(err => console.error(err));
        setSearchCode('')
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
            setShowModal(false)
            setNewRoom(prev => { return { ...prev, password: '', code: '', name: '', private: false } })
            delete newRoom.quizInfo
        }, 300)
    }

    async function createNewRoom() {
        if (!newRoom.quizInfo) {
            showInfoToast("Nenhum Quiz Selecitonado.", 3000)
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
                {showModal && <Modal closeModal={closeModal} showModalOpacity={showModalOpacity}
                    head={
                        <div>
                            <h2>Criar Sala</h2>
                        </div>
                    }
                    body={
                        <div>
                            <label>Nome: </label>
                            <input onChange={handleNewCodeChange} value={newRoom.name} />
                            <label>Private: </label>
                            <input type="checkbox" onChange={handleNewIsPrivate} checked={newRoom.private} />
                            {newRoom.private &&
                                <div>
                                    <label>Senha: </label>
                                    <input onChange={handleNewPasswordChange} value={newRoom.password} />
                                </div>
                            }
                            <Select
                                placeholder='Quiz'
                                onChange={handleQuizSelectorChange}
                                options={session.user.quizzesInfos.map((quiz, i) => { return { value: i, label: quiz.name } })}
                            />
                        </div>
                    }
                    foot={
                        <div>
                            <button onClick={closeModal}>Cancelar</button>
                            <button onClick={createNewRoom} disabled={disableCreateNewRoom} >{disableCreateNewRoom ? "Criando" : "Criar"}</button>
                        </div>
                    }
                />}
                <input onChange={handleCodeChange} value={searchCode} />
                <button onClick={handleSubmitCode}>Entrar</button>
                <button onClick={openModal}>Criar Sala</button>
            </main>
        </div>
    )
}