import { withRouter } from 'next/router'
import styles from '../styles/profiles.module.css'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import NoSessionPage from '@/components/NoSessionPage';

export default withRouter((props) => {
    const { session, signIn } = props
    const { id } = props.router.query
    const [user, setUser] = useState()

    useEffect(() => {
        if (!user)
            getUser(id)
    }, [id])

    async function getUser(id) {
        const options = {
            method: 'GET',
            headers: { 'id': id },
        }

        await fetch('/api/users', options)
            .then(response => response.json())
            .then(response => setUser(response.user))
            .catch(err => console.error(err))
    }

    return (
        <div>
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <div id={styles.container}>
                    {user &&
                        <main>
                            <div id={styles.header}>
                                {session.user.id === id &&
                                    <Button variant="outlined" startIcon={<EditIcon />}>
                                        Editar
                                    </Button>
                                }
                            </div>
                            <section id={styles.one}>
                                <div id={styles.avatarContainer}>
                                    <img src={user.image} />
                                </div>
                                <div>
                                    <h2>{user.name}</h2>
                                </div>
                            </section>
                        </main>
                    }
                </div >
            }
        </div>
    )
})