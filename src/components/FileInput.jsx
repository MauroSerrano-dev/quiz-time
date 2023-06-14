
import styles from '../styles/components/FileInput.module.css'
import { showErrorToast } from '../../utils/toasts'
import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'

// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import CropIcon from '@mui/icons-material/Crop'

export default function FileInput(props) {
    const {
        setQuiz,
        currentSlide,
        img,
        type,
        index,
        width,
        height
    } = props

    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [containerSize, setContainerSize] = useState()

    useEffect(() => {
        setContainerSize({
            width: document.getElementsByClassName(styles.container)[index].offsetWidth,
            height: document.getElementsByClassName(styles.container)[index].offsetHeight,
        })

        function handleResize() {
            setContainerSize({
                width: document.getElementsByClassName(styles.container)[index].offsetWidth,
                height: document.getElementsByClassName(styles.container)[index].offsetHeight,
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
        console.log(event)
        event.preventDefault();
        setIsDraggingOver(false);
        const files = event.dataTransfer.files;

        handleUploadImgProfile({ target: { files: files } })
    }

    function handleUploadImgProfile(event) {
        console.log(event)
        if (event.target.files.length > 0) {
            const file = event.target.files[0];


            if (event.target.files.length > 1)
                showErrorToast("Não é possível carregar multiplos arquivos.", 3000)
            else if (file.type.split('/')[0] !== 'image')
                showErrorToast("Tipo incorreto, por favor insira uma imagem.", 3000)
            else if (file.size > 4194304)
                showErrorToast("Por favor insira uma imagem menor que 4MB.", 3000)
            else {
                const reader = new FileReader()

                const url = URL.createObjectURL(file)
                const img = new Image()

                img.onload = function () {
                    setQuiz(prev => ({
                        ...prev,
                        [type]: prev[type].map((item, i) =>
                            currentSlide === i
                                ? {
                                    ...item, img: {
                                        ...item.img,
                                        positionToFit: this.height > this.width || (this.width / this.height <= containerSize.width / containerSize.height)
                                            ? 'vertical'
                                            : 'horizontal',
                                    }
                                }
                                : item)
                    }))
                    URL.revokeObjectURL(url)
                }

                img.src = url

                reader.onload = (e) => {
                    const fileContent = e.target.result
                    const fileName = file.name
                    const fileType = file.type

                    setQuiz(prev => ({
                        ...prev,
                        [type]: prev[type].map((item, i) =>
                            currentSlide === i
                                ? {
                                    ...item,
                                    img: {
                                        ...item.img,
                                        content: fileContent,
                                        name: fileName,
                                        type: fileType,
                                    }
                                }
                                : item)
                    }))
                }
                reader.readAsDataURL(file);
            }
        }
    }

    function deleteProfileImg() {
        setQuiz(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) =>
                currentSlide === i
                    ? { ...item, img: { content: '', name: '', type: '', positionToFit: '' } }
                    : item)
        }))
    }

    return (
        <div className={styles.container}
            style={{
                width: width ? width : '100%',
                height: height ? height : '100%',
            }}
        >
            {containerSize &&
                <div className='flex start size100'>
                    <div
                        className={styles.imgContainer}
                        onDragEnter={handleDragEnter}
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
                                    style={img.positionToFit === 'vertical' ? { height: 'auto', width: '100%' } : { height: '100%', width: 'auto' }}
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
                                    <input
                                        type='file'
                                        className={styles.uploadImgInside}
                                        onChange={handleUploadImgProfile}
                                        title=""
                                    />
                                </div>
                                <p style={{ fontSize: `${containerSize.width * 0.04}px` }} className={styles.dragText}>Ou arraste uma imagem para enviar</p>
                                <input
                                    type='file'
                                    className={styles.uploadImg}
                                    onChange={handleUploadImgProfile}
                                    title=""
                                />
                            </div>
                        }
                    </div>
                    {img.content !== '' &&
                        <div
                            className={styles.userImgButtons}
                            style={{
                                gap: `${containerSize.width * 0.03}px`,
                                bottom: `${containerSize.height * 0.03}px`
                            }}
                        >
                            <IconButton
                                className={styles.buttons}
                                color='neutral'
                                size='small'
                                style={{
                                    backgroundColor: '#00000080',
                                    width: `${containerSize.width * 0.11}px`,
                                    height: `${containerSize.width * 0.11}px`,
                                    transition: 'all ease 200ms'
                                }}
                            >
                                <CropIcon
                                    style={{
                                        width: `${containerSize.width * 0.08}px`,
                                        height: `${containerSize.width * 0.08}px`,
                                    }}
                                />
                            </IconButton>
                            <IconButton
                                className={styles.buttons}
                                color='neutral' 
                                onClick={deleteProfileImg}
                                size='small'
                                style={{
                                    backgroundColor: '#00000080',
                                    width: `${containerSize.width * 0.11}px`,
                                    height: `${containerSize.width * 0.11}px`,
                                    transition: 'all ease 200ms'
                                }}
                            >
                                <DeleteForeverIcon
                                    style={{
                                        width: `${containerSize.width * 0.09}px`,
                                        height: `${containerSize.width * 0.09}px`
                                    }}
                                />
                            </IconButton>
                        </div>
                    }
                </div>
            }
        </div>
    )
}
