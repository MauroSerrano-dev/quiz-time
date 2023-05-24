import { withRouter } from 'next/router'
import styles from '../styles/profiles.module.css'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';

export default withRouter((props) => {
    const { session } = props
    const { id } = props.router.query
    const [user, setUser] = useState()

    useEffect(() => {
        getUser(id)
    }, [id])

    async function getUser(id) {
        const options = {
            method: 'GET',
            headers: { "id": id },
        }

        await fetch('/api/users', options)
            .then(response => response.json())
            .then(response => setUser(response.user))
            .catch(err => console.error(err))
    }

    return (
        <div className={styles.container}>
            {user &&
                <main>
                    <div className={styles.header}>
                        {session.user.id === id &&
                            <Button variant="outlined" startIcon={<EditIcon />}>
                                Editar
                            </Button>
                        }
                    </div>
                    <section className={styles.one}>
                        <div className={styles.avatarContainer}>
                            <img src={user.image} />
                        </div>
                        <div>
                            <h2>{user.name}</h2>
                        </div>
                    </section>
                </main>
            }
        </div >
    )
})