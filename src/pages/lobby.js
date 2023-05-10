import Router from "next/router";
import { useState } from "react";
import styles from '../styles/lobby.module.css'
import Modal from "@/components/Modal";
import Select from "react-select";

let socket;

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

export default function Lobby() {
    const [code, setCode] = useState('')
    const [requestState, setRequestState] = useState('denied')
    const [showModal, setShowModal] = useState(false)
    const [showModalOpacity, setShowModalOpacity] = useState(false)

    function handleCodeChange(event) {
        setCode(event.target.value)
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

    }

    function openModal() {
        setShowModalOpacity(true)
        setShowModal(true)
    }

    function closeModal() {
        setShowModalOpacity(false)
        setTimeout(() => setShowModal(false), 300)
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
                            <input />
                            <label>Private: </label>
                            <input type="checkbox" />
                            <Select
                                placeholder='Quiz'
                                onChange={() => console.log('')}
                                options={options}
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