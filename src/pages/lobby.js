import Router from "next/router";
import { useState } from "react";

let socket;

export default function Lobby() {
    const [code, setCode] = useState('')
    const [requestState, setRequestState] = useState('denied')

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
                if(response.room){
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

    return (
        <div>
            <main>
                <input onChange={handleCodeChange} value={code} />
                <button onClick={handleSubmitCode}>Entrar</button>
                {requestState === 'fail' && <p>Essa sala não existe</p>}
            </main>
        </div>
    );
}
