import io from "socket.io-client";
import styles from '../styles/index.module.css'
import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import Head from 'next/head'

let socket;

export default function Index() {
  const [room, setRoom] = useState();
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      socketInitializer();
    }
  }, [session]);

  const socketInitializer = async () => {
    const options = {
      method: 'GET',
      headers: { email: session.user.email },
    };
    await fetch("/api/socket", options)

    socket = io();

    socket.on("getData", (data) => {
      setRoom(data)
    });

    socket.on("updateFields", (roomAttFields) => {
      setRoom(prev => { return { ...prev, ...roomAttFields } })
    });
  };

  const handleClick = async () => {
    socket.emit("updateRoom", { code: room.code, active: !room.active });
  };

  return (
    <div>
      <Head>
        <title>Quiz Time</title>
        <meta name="description" content="Quiz Buider App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {room && session && <div className={styles.box} onClick={handleClick} style={{ backgroundColor: room.active ? 'red' : 'blue' }}></div>}
      </main>
    </div>
  );
}