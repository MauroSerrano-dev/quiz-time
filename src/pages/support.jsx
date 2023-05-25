import { useState } from 'react'
import styles from '../styles/support.module.css'
import { Button, Select, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

const INICIAL_TICKET = {
    category: '',
    value: '',
}

export default function Support(props) {
    const { session } = props
    const [newTicket, setNewTicket] = useState({ ...INICIAL_TICKET, userEmail: session.user.email })

    async function createNewTicket() {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTicket)
        }

        await fetch('/api/ticket', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
    }

    return (
        <div>
            <main>
                {/* <Select
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
                </Select> */}
                <TextField
                    id="standard-multiline-static"
                    label="Ticket"
                    multiline
                    rows={8}
                    variant="filled"
                />
                <Button variant="outlined" endIcon={<SendIcon />}>
                    Enviar
                </Button>
            </main>
        </div>
    )
}