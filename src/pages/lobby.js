import Router from "next/router";
import { useEffect, useState } from "react";
import styles from '../styles/lobby.module.css'
import Modal from "../components/Modal";
import Select from "react-select";

let socket;

export default function Lobby(props) {
    const { session } = props
    const [newRoom, setNewRoom] = useState({ code: '', private: false })
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

    function handleNewIsPrivite(event) {
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
                console.log(response)
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
        console.log(newRoom)
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
        setTimeout(() => setShowModal(false), 300)
    }

    function handleQuizSelectorChange(event) {
        setNewRoom(prev => { return { ...prev, quizInfo: session.user.quizzesStandardInfos.concat(session.user.quizzesCustomInfos)[event.value] } })
    }

    return (
        <div>
            <main>
                {showModal && <Modal closeModal={closeModal} showModalOpacity={showModalOpacity}
                    head={
                        <div>
                            <h2>Criar Game</h2>
                        </div>
                    }
                    body={
                        <div>
                            <label>Nome: </label>
                            <input onChange={handleNewCodeChange} value={newRoom.code} />
                            <label>Private: </label>
                            <input type="checkbox" onChange={handleNewIsPrivite} checked={newRoom.privite} />
                            <Select
                                placeholder='Quiz'
                                onChange={handleQuizSelectorChange}
                                options={session.user.quizzesStandardInfos.concat(session.user.quizzesCustomInfos).map((quiz, i) => { return { value: i, label: quiz.name } })}
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
                <button onClick={openModal}>Criar Game</button>
                {requestState === 'fail' && <p>Esta sala não existe</p>}
            </main>
        </div>
    );
}