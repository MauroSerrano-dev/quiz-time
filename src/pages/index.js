import io from "socket.io-client";
import styles from '../styles/index.module.css'
import { useState, useEffect } from "react";

let socket;

export default function Index() {
  const [quiz, setQuiz] = useState();

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    const options = {
      method: 'GET',
      headers: { "email": 'mauro.r.serrano.f@gmail.com'/* session.user.email  */ },
    };
    await fetch("/api/socket", options)

    socket = io();

    socket.on("getData", (data) => {
      setQuiz(data)
    });
  };

  const handleClick = async () => {
    socket.emit("updateQuiz", { code: quiz.code, active: !quiz.active });
    setQuiz(prev => { return { ...prev, active: !prev.active } })
  };

  return (
    <div>
      <main>
        {quiz && <div className={styles.box} onClick={handleClick} style={{ backgroundColor: quiz.active ? 'red' : 'blue' }}></div>}
      </main>
    </div>
  );
}