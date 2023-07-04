import { withRouter } from 'next/router'
import { QRCode } from 'react-qrcode-logo';
import styles from '../styles/room.module.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import { Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PlayersList from '@/components/PlayersList';
import NoSessionPage from '@/components/NoSessionPage';
import { getImage, getStandardQuiz, getUserQuiz } from '../../utils/api-caller';
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import OptionInput from '@/components/OptionInput';
import ChartPie from '@/components/ChartPie';

let socket;

const TRANSITION_DURATION = 200

const containerAnimation = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        }
    }
}

const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}

export default withRouter((props) => {
    const {
        session,
        signIn,
        setShowNavbar
    } = props
    const [room, setRoom] = useState()
    const [disableShow, setDisableShow] = useState(false)
    const [activeShow, setActiveShow] = useState(false)
    const [noRoom, setNoRoom] = useState(false)
    const [quiz, setQuiz] = useState()
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { code } = props.router.query

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    useEffect(() => {
        setShowNavbar(false)
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        if (!room && code && session) {
            socketInitializer()
        }
    }, [session, code])

    useEffect(() => {
        console.log(room, quiz)
    }, [room, quiz])

    useEffect(() => {
        if (room && room.quizInfo.id !== '' && !quiz) {
            async function getQuiz() {
                let quizResponse
                if (room.quizInfo.type === 'standard')
                    quizResponse = await getStandardQuiz(room.quizInfo.id)
                else
                    quizResponse = await getUserQuiz(room.quizInfo.creator.id, room.quizInfo.id)

                try {
                    const response = await quizResponse.json()
                    const updatedQuiz = {
                        ...response.quiz,
                        questions: await Promise.all(response.quiz.questions.map(async (question) => {
                            const img = question.img && question.img.id
                                ? await getImage(room.quizInfo.creator.uui, question.img.id)
                                : null
                            const options = await Promise.all(question.options.map(async (option) => {
                                const optionImg = option.img && option.img.id
                                    ? await getImage(room.quizInfo.creator.uui, option.img.id)
                                    : null
                                return { ...option, img: optionImg }
                            }));
                            return { ...question, img: img, options: options }
                        })),
                        results: await Promise.all(response.quiz.results.map(async (result) => {
                            const img = result.img.id
                                ? await getImage(room.quizInfo.creator.uui, result.img.id)
                                : null
                            return { ...result, img: img };
                        })),
                    }

                    setQuiz(updatedQuiz)
                } catch (err) {
                    console.error(err)
                }
            }
            getQuiz()
        }
    }, [room])

    const socketInitializer = async () => {
        const options = {
            method: 'GET'
        }
        await fetch("/api/socket", options)

        socket = io({ query: { code: code } })

        socket.emit('getRoom', code)

        socket.on(`sendRoom${code}`, (room) => {
            if (room) {
                setRoom(room)
                setDisableShow(room.state === 'disable')
                setActiveShow(room.state === 'active')
            }
            else {
                setNoRoom(true)
            }
        })

        socket.on(`updateFieldsRoom${code}`, (att) => {
            const { roomAtt } = att
            setDisableShow(roomAtt.state === 'disable')
            setActiveShow(roomAtt.state === 'active')
            setRoom(roomAtt)
        })
    }

    return (
        <div className='size100' onClick={() => console.log(room, quiz)}>
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <div id={styles.container}>
                    <div className='size100'>
                        {!room && noRoom &&
                            <div>
                                <h1 id={styles.roomName}>Esta sala não existe</h1>
                            </div>
                        }
                        {room &&
                            <div id={styles.roomContainer}>
                                <h3 id={styles.roomName}>Código da Sala: {room.name}</h3>
                                {session.user.id === room.owner.id &&
                                    <div className='size100'>
                                        <Button
                                            onClick={toggleFullscreen}
                                            variant="outlined"
                                            sx={{
                                                position: 'absolute',
                                                right: '2rem',
                                                top: '2rem',
                                            }}
                                            endIcon={isFullscreen
                                                ? <CloseFullscreenRoundedIcon />
                                                : <OpenInFullRoundedIcon
                                                />}
                                        >
                                            {isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                                        </Button>
                                        {room.state === 'disable' &&
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={disableShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                                                transition={{ delay: disableShow ? 0.5 : 0, duration: disableShow ? 1.2 : 0.6, easings: ["easeInOut"] }}
                                                id={styles.disableContainer}
                                            >
                                                <div id={styles.qrContainer}>
                                                    <div id={styles.qrCode}>
                                                        <QRCode
                                                            value={`${process.env.NEXT_PUBLIC_SITE_DOMAIN}/quiz?code=${code}`}
                                                            size={200}
                                                            ecLevel='H'
                                                            qrStyle='dots'
                                                            logoImage='logos/logo-white-blue.png'
                                                            logoWidth={200 * 0.9}
                                                            logoOpacity={0.5}
                                                            eyeColor={{
                                                                outer: '#00a0dc',
                                                                inner: '#005270'
                                                            }}
                                                            eyeRadius={5} />
                                                    </div>
                                                    <h2>Scan Me!</h2>
                                                    <div className={styles.frame}></div>
                                                    <div className={styles.frame} id={styles.border}></div>
                                                    <div id={styles.textContainer}></div>
                                                </div>
                                                <h2>Ou</h2>
                                                <div id={styles.linkContainer}>
                                                    <h2>Entre no link:</h2>
                                                    <a href={`${process.env.NEXT_PUBLIC_SITE_URL}/quiz?code=${code}`} target='_blank'>
                                                        <h2>{process.env.NEXT_PUBLIC_SITE_DOMAIN}/quiz?code={code}</h2>
                                                    </a>
                                                </div>
                                            </motion.div>
                                        }
                                        {room.state === 'active' && quiz &&
                                            <div id={styles.activeContainer}>
                                                <motion.div
                                                    id={styles.questionContainer}
                                                    initial={{ opacity: 0 }}
                                                    animate={false ? { opacity: 0 } : { opacity: 1 }}
                                                    transition={{ duration: TRANSITION_DURATION / 1000, ease: [.62, -0.18, .32, 1.17] }}
                                                >
                                                    <h1>
                                                        {`${room.currentQuestion + 1}. ${quiz.questions[room.currentQuestion].content}`}
                                                    </h1>
                                                </motion.div>
                                                <motion.div
                                                    id={styles.optionsContainer}
                                                    variants={containerAnimation}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    <motion.div
                                                        variants={itemAnimation}
                                                        className={`${styles.optionsRow} ${quiz.style.button.template === 'custom'
                                                            ? styles.rowExtraOptions
                                                            : undefined}`
                                                        }
                                                    >
                                                        <OptionInput
                                                            borderRadius={quiz.style.button.borderRadius}
                                                            textColor={quiz.style.button.textColor}
                                                            symbolColor={quiz.style.button.symbolColor}
                                                            option={0}
                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                ? quiz.style.button.color
                                                                : undefined
                                                            }
                                                            symbol={quiz.style.button.symbol}
                                                            variant={quiz.style.button.variant}
                                                            text={quiz.questions[room.currentQuestion].options[0].content}
                                                            hideText={false}
                                                            size='responsive'
                                                        />
                                                        <OptionInput
                                                            borderRadius={quiz.style.button.borderRadius}
                                                            textColor={quiz.style.button.textColor}
                                                            symbolColor={quiz.style.button.symbolColor}
                                                            option={1}
                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                ? quiz.style.button.color
                                                                : undefined
                                                            }
                                                            symbol={quiz.style.button.symbol}
                                                            variant={quiz.style.button.variant}
                                                            text={quiz.questions[room.currentQuestion].options[1].content}
                                                            hideText={false}
                                                            size='responsive'
                                                        />
                                                    </motion.div>
                                                    <motion.div
                                                        variants={itemAnimation}
                                                        className={`${styles.optionsRow} ${quiz.style.button.template === 'custom'
                                                            ? styles.rowExtraOptions
                                                            : undefined}`
                                                        }
                                                    >
                                                        <OptionInput
                                                            borderRadius={quiz.style.button.borderRadius}
                                                            textColor={quiz.style.button.textColor}
                                                            symbolColor={quiz.style.button.symbolColor}
                                                            option={2}
                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                ? quiz.style.button.color
                                                                : undefined
                                                            }
                                                            symbol={quiz.style.button.symbol}
                                                            variant={quiz.style.button.variant}
                                                            text={quiz.questions[room.currentQuestion].options[2].content}
                                                            hideText={false}
                                                            size='responsive'
                                                        />
                                                        <OptionInput
                                                            borderRadius={quiz.style.button.borderRadius}
                                                            textColor={quiz.style.button.textColor}
                                                            symbolColor={quiz.style.button.symbolColor}
                                                            option={3}
                                                            colorValue={quiz.style.button.template === 'monochrome'
                                                                ? quiz.style.button.color
                                                                : undefined
                                                            }
                                                            symbol={quiz.style.button.symbol}
                                                            variant={quiz.style.button.variant}
                                                            text={quiz.questions[room.currentQuestion].options[3].content}
                                                            hideText={false}
                                                            size='responsive'
                                                        />
                                                    </motion.div>
                                                    {quiz.style.button.template === 'custom' &&
                                                        <motion.div
                                                            variants={itemAnimation}
                                                            className={`${styles.optionsRow} ${quiz.style.button.template === 'custom'
                                                                ? styles.rowExtraOptions
                                                                : undefined}`
                                                            }
                                                        >
                                                            <OptionInput
                                                                borderRadius={quiz.style.button.borderRadius}
                                                                textColor={quiz.style.button.textColor}
                                                                symbolColor={quiz.style.button.symbolColor}
                                                                option={4}
                                                                colorValue={quiz.style.button.template === 'monochrome'
                                                                    ? quiz.style.button.color
                                                                    : undefined
                                                                }
                                                                symbol={quiz.style.button.symbol}
                                                                variant={quiz.style.button.variant}
                                                                text={quiz.questions[room.currentQuestion].options[4].content}
                                                                hideText={false}
                                                                size='responsive'
                                                            />
                                                            <OptionInput
                                                                borderRadius={quiz.style.button.borderRadius}
                                                                textColor={quiz.style.button.textColor}
                                                                symbolColor={quiz.style.button.symbolColor}
                                                                option={5}
                                                                colorValue={quiz.style.button.template === 'monochrome'
                                                                    ? quiz.style.button.color
                                                                    : undefined
                                                                }
                                                                symbol={quiz.style.button.symbol}
                                                                variant={quiz.style.button.variant}
                                                                text={quiz.questions[room.currentQuestion].options[5].content}
                                                                hideText={false}
                                                                size='responsive'
                                                            />
                                                        </motion.div>
                                                    }
                                                </motion.div>
                                            </div>
                                        }
                                        {room.state === 'finish' &&
                                            <div>
                                                <h2>Finalizado</h2>
                                            </div>
                                        }
                                        {room.state === 'results' &&
                                            <div>
                                                <h2>Estatísticas</h2>
                                                <div className='flex center fillWidth'>
                                                    <ChartPie
                                                        data={Object.keys(room.players).map(key => room.players[key].results).reduce((acc, result) => acc.concat(result), [])}
                                                        totalPoints={Object.keys(room.players).length}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        {quiz &&
                                            <PlayersList
                                                players={room.players === undefined ? [] : Object.keys(room.players).map(index => room.players[index])}
                                                totalQuestions={room.quizInfo.totalQuestions}
                                                noProgressBar={room.control}
                                            />
                                        }
                                    </div>
                                }
                                {session.user.id !== room.owner.id &&
                                    <div>
                                        <h3>Esta é a visão de quem não é dono da sala</h3>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
})