
import styles from '../styles/components/FileInput.module.css'
import { showErrorToast } from '../../utils/toasts'
import { useEffect, useRef, useState } from 'react'
import { Button, IconButton } from '@mui/material'
// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import CropIcon from '@mui/icons-material/Crop'
import Modal from './Modal'
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import GifBoxRoundedIcon from '@mui/icons-material/GifBoxRounded';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID_AWS,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY_AWS,
});


export default function FileInput(props) {
    const {
        quiz,
        setQuiz,
        currentSlide,
        img,
        type,
        width,
        height,
        INICIAL_IMG,
        session,
        changeScale,
        step
    } = props

    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showModalOpacity, setShowModalOpacity] = useState(false)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const s3 = new AWS.S3();

    const containerRef = useRef(null)

    useEffect(() => {
        handleResize()
        function handleResize() {
            setContainerSize({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function handleDragEnter(event) {
        event.preventDefault();
        setIsDraggingOver(true);
    }

    function handleDragLeave() {
        setIsDraggingOver(false);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        setIsDraggingOver(false);
        const files = event.dataTransfer.files

        handleUploadImg({ target: { files: files } })
    }

    function handleUploadImg(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            if (event.target.files.length > 1)
                showErrorToast("Não é possível carregar multiplos arquivos.", 3000)
            else if (file.type.split('/')[0] !== 'image'
                || file.type.split('/')[1].includes('svg'))
                showErrorToast("Tipo incorreto, por favor insira uma imagem.", 3000)
            else if (file.size > 1048576)
                showErrorToast("Por favor insira uma imagem menor que 1MB.", 3000)
            else {
                const reader = new FileReader()

                const url = URL.createObjectURL(file)
                const img = new Image()

                img.src = url

                reader.onload = (e) => {
                    const fileContent = e.target.result
                    const fileName = file.name
                    const fileType = file.type
                    img.onload = async function () {
                        const newImg = {
                            content: fileContent,
                            name: fileName,
                            type: fileType,
                            positionToFit: this.height > this.width
                                || (this.width / this.height <= containerSize.width / containerSize.height)
                                ? 'vertical'
                                : 'horizontal',
                        }

                        putImg(newImg)
                        uploadImageToS3(newImg)

                        /* const options = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                userEmail: session.user.email,
                                field: 'img',
                                type: step === 0
                                    ? 'results'
                                    : 'questions',
                                elementId: quiz[
                                    step === 0
                                        ? 'results'
                                        : 'questions'][currentSlide].id,
                                newImg: newImg,
                            })
                        }

                        await fetch('/api/users', options)
                            .then(response => response.json())
                            .then(response => {
                                console.log(response)
                            })
                            .catch(err => console.error(err)) */
                        URL.revokeObjectURL(url)
                    }
                }
                reader.readAsDataURL(file);
            }
        }
    }

    // Função para fazer o upload do newImg para o Amazon S3
    async function uploadImageToS3(newImg) {
        const bucketName = 'tamaluco'; // Nome do seu bucket no Amazon S3
        const fileName = newImg.name; // Nome do arquivo a ser armazenado no S3
        const fileContent = newImg.content; // Conteúdo do arquivo em formato base64
        const fileType = newImg.type; // Tipo do arquivo

        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileContent,
            ContentType: fileType,
        };

        try {
            await s3.putObject(params).promise();
            console.log('Upload concluído com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer o upload:', error);
        }
    }

    function deleteImg() {
        setQuiz(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) =>
                currentSlide === i
                    ? { ...item, img: INICIAL_IMG }
                    : item)
        }))
    }

    function closeModal() {
        setShowModalOpacity(false)
        setTimeout(() => {
            setShowModal(false)
        }, 300)
    }

    function openModal() {
        if (img.content === '' && showModal === false) {
            setShowModal(true)
            setTimeout(() => {
                setShowModalOpacity(true)
            }, 300)
        }
    }

    function putImg(newImg) {
        setQuiz(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) =>
                currentSlide === i
                    ? {
                        ...item,
                        img: newImg
                    }
                    : item)
        }))
    }

    return (
        <div
            className={styles.container}
            ref={containerRef}
            style={{
                width: width ? width : '100%',
                height: height ? height : '100%',
            }}
        >
            <div className='flex start size100'>
                <div
                    className={`${styles.imgContainer} ${changeScale
                        ? styles.imgContainerHover
                        : undefined
                        }`
                    }
                    onClick={openModal}
                    onDragEnter={handleDragEnter}
                    style={{
                        cursor: img.content === ''
                            ? 'pointer'
                            : 'default'
                    }}
                >
                    {isDraggingOver &&
                        <div
                            className={styles.dragContainer}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <h3>Solte a imagem aqui para carregá-la</h3>
                        </div>
                    }
                    {img.content !== ''
                        ? <div className={styles.userImgContainer}>
                            <img
                                style={img.positionToFit === 'vertical'
                                    ? { height: 'auto', width: '100%' }
                                    : { height: '100%', width: 'auto' }}
                                src={img.content}
                            />
                        </div>
                        : <div className={styles.noImgContainer}>
                            <div
                                className={styles.addButton}
                                style={{
                                    width: `${containerSize.width * 0.11}px`,
                                    height: `${containerSize.width * 0.11}px`
                                }}
                            >
                                <AddIcon
                                    style={{
                                        width: `${containerSize.width * 0.08}px`,
                                        height: `${containerSize.width * 0.08}px`
                                    }}
                                />
                                {/* <input
                                        tabIndex='-1'
                                        type='file'
                                        className={styles.uploadImgInside}
                                        onChange={handleUploadImg}
                                        title=""
                                    /> */}
                            </div>
                            <p
                                style={{ fontSize: `${containerSize.width * 0.04}px` }}
                                className={styles.dragText}
                            >
                                Ou arraste uma imagem para enviar
                            </p>
                            {/* <input
                                    type='file'
                                    className={styles.uploadImg}
                                    onChange={handleUploadImg}
                                    title=""
                                /> */}
                        </div>
                    }
                    {img.content !== '' &&
                        <div
                            className={styles.userImgButtons}
                            style={{
                                gap: `${containerSize.width * 0.02}px`,
                                bottom: `${containerSize.height * 0.03}px`
                            }}
                        >
                            {/* <IconButton
                                className={styles.buttons}
                                color='neutral'
                                size='small'
                                style={{
                                    backgroundColor: '#00000080',
                                    width: `${containerSize.width * 0.085}px`,
                                    height: `${containerSize.width * 0.085}px`,
                                    transition: 'all ease 200ms'
                                }}
                            >
                                <CropIcon
                                    style={{
                                        width: `${containerSize.width * 0.065}px`,
                                        height: `${containerSize.width * 0.065}px`,
                                    }}
                                />
                            </IconButton> */}
                            <IconButton
                                className={styles.buttons}
                                color='neutral'
                                onClick={deleteImg}
                                size='small'
                                style={{
                                    backgroundColor: '#00000080',
                                    width: `${containerSize.width * 0.085}px`,
                                    height: `${containerSize.width * 0.085}px`,
                                    transition: 'all ease 200ms'
                                }}
                            >
                                <DeleteForeverIcon
                                    style={{
                                        width: `${containerSize.width * 0.065}px`,
                                        height: `${containerSize.width * 0.065}px`
                                    }}
                                />
                            </IconButton>
                        </div>
                    }
                </div>
            </div>
            {showModal &&
                <Modal
                    width={'550px'}
                    height={'450px'}
                    widthMobile={'350px'}
                    heightMobile={'450px'}
                    widthSmall={'250px'}
                    heightSmall={'450px'}
                    closeModal={closeModal}
                    showModalOpacity={showModalOpacity}
                    body={
                        <div className={styles.modalBody} >
                            <div
                                className={styles.tabsContainer}
                            >
                                <Button
                                    startIcon={
                                        <AccountBoxRoundedIcon
                                            sx={{
                                                scale: '1.3'
                                            }} />}
                                    size='small'
                                    variant='contained'
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        height: '12%',
                                        borderRadius: '0px'
                                    }}
                                >
                                    Meus
                                </Button>
                                <Button
                                    startIcon={
                                        <GifBoxRoundedIcon
                                            sx={{
                                                scale: '1.3'
                                            }} />}
                                    size='small'
                                    variant='outlined'
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        width: '100%',
                                        height: '12%',
                                        borderRadius: '0px'
                                    }}
                                >
                                    GIF
                                </Button>
                            </div>
                            <div
                                className={styles.imgsContainer}
                            >
                                <input
                                    type='file'
                                    /* className={styles.uploadImgInside} */
                                    onChange={handleUploadImg}
                                    value=''
                                    title=''
                                />
                            </div>
                        </div>
                    }
                />
            }
        </div>
    )
}
