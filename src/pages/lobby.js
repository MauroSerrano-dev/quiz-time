import Router from "next/router";
import { useEffect, useState } from "react";
import styles from '../styles/lobby.module.css'
import Modal from "../components/Modal";
import Select from "react-select";

let socket;

export default function Lobby(props) {
    const { session } = props
    const [newRoom, setNewRoom] = useState({ code: '', private: false, password: '' })
    const [code, setCode] = useState('')
    const [requestState, setRequestState] = useState('denied')
    const [showModal, setShowModal] = useState(false)
    const [showModalOpacity, setShowModalOpacity] = useState(false)

    useEffect(() => {
        if (session && !newRoom.owner) {
            setNewRoom(prev => { return { ...prev, owner: session.user.email } })
        }
    }, [session])

    function handleCodeChange(event) {
        setCode(event.target.value)
    }

    function handleNewCodeChange(event) {
        setNewRoom(prev => { return { ...prev, code: event.target.value } })
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
            headers: { "code": code },
        };
        await fetch("/api/rooms", options)
            .then(response => response.json())
            .then(response => {
                if (response.room) {
                    Router.push(`/room?code=${code}`)
                }
                else {
                    setRequestState('fail')
                    //mudar para toast
                }
            })
            .catch(err => console.error(err));
        setCode('')
    }

    function createNewRoom() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        };

        fetch('/api/rooms', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    function openModal() {
        setShowModalOpacity(true)
        setShowModal(true)
    }

    function closeModal() {
        setShowModalOpacity(false)
        setTimeout(() => {
            setShowModal(false)
            setNewRoom(prev => { return { ...prev, password: '', code: '', private: false } })
                , 300
        })
    }

    function handleQuizSelectorChange(event) {
        setNewRoom(prev => { return { ...prev, quizInfo: session.user.quizzesInfos[event.value] } })
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
                            <input onChange={handleNewCodeChange} value={newRoom.code} />
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
                            <button onClick={createNewRoom}>Criar</button>
                        </div>
                    }
                />}
                <input onChange={handleCodeChange} value={code} />
                <button onClick={handleSubmitCode}>Entrar</button>
                <button onClick={openModal}>Criar Sala</button>
                {requestState === 'fail' && <p>Esta sala não existe</p>}
            </main>
        </div>
    )
}