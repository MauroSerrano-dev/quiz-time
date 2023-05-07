import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import $ from 'jquery'
import { useEffect, useState } from 'react';

export default withRouter((props) => {
    const [size, setSize] = useState()

    useEffect(() => {
        const newSize = $(`.${styles.qrContainer}`).css("width")
        setSize(Number(newSize.slice(0, newSize.length - 2)) * 0.7)
    }, [])

    const { code } = props.router.query
    return (
        <div>
            <main>
                <h1 className={styles.roomName}>Essa é a sala: {code}</h1>
                <div className={styles.qrContainer}>
                    {size && <div className={styles.qrCode}><QRCode value={`quiz-maker.herokuapp.com/room?code=${code}`} size={size} ecLevel='H' qrStyle='dots' logoImage='quiz-time-logo.png' logoWidth={size * 0.6} logoOpacity={0.5} eyeColor={{ outer: '#00a0dc', inner: '#005270' }} eyeRadius={5} /></div>}
                    <h2>Scan Me!</h2>
                    <div className={styles.frame}></div>
                    <div className={`${styles.frame} ${styles.border}`}></div>
                    <div className={styles.textContainer}></div>
                </div>
                {code === 'max' && <div className={styles.qrContainer}>
                    {size && <div className={styles.qrCode}><QRCode value={'https://hotmart.com/pt-br/marketplace/produtos/assuma-o-comando-julho/Y81867951D'} size={size} ecLevel='H' qrStyle='dots' logoImage='max-logo.png' logoWidth={size * 0.8} logoOpacity={0.5} eyeColor={{ outer: '#9c170f', inner: 'black' }} eyeRadius={5} /></div>}
                    <h2>Scan Me!</h2>
                    <div className={styles.frame}></div>
                    <div className={`${styles.frame} ${styles.border}`}></div>
                    <div className={styles.textContainer}></div>
                </div>}
                {code === 'rede' && <div className={styles.qrContainer}>
                    {size && <div className={styles.qrCode}><QRCode value={'redeconexaomulher.com'} size={size} ecLevel='H' qrStyle='dots' logoImage='rede.ico' logoWidth={size * 0.6} logoOpacity={0.5} eyeColor={{ outer: '#f2505d', inner: '#f1766b' }} eyeRadius={5} /></div>}
                    <h2>Scan Me!</h2>
                    <div className={styles.frame}></div>
                    <div className={`${styles.frame} ${styles.border}`}></div>
                    <div className={styles.textContainer}></div>
                </div>}
            </main>
        </div>
    );
})