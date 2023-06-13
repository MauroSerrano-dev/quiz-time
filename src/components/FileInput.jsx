
import styles from '../styles/components/FileInput.module.css'
import { showErrorToast } from '../../utils/toasts'
import { useState } from 'react'
import { IconButton } from '@mui/material'

// ICONS
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddIcon from '@mui/icons-material/Add'
import CropIcon from '@mui/icons-material/Crop'
import InfoIcon from '@mui/icons-material/Info'

export default function FileInput(props) {
    const {
        quiz,
        setQuiz,
        currentSlide,
        img,
        type,
    } = props

    const [isDraggingOver, setIsDraggingOver] = useState(false)

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
                                        positionToFit: this.height > this.width || (this.width / this.height <= 500 / 300)
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
        <div className={styles.container}>
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
                        <div className={styles.addButton}>
                            <AddIcon />
                            <input
                                type='file'
                                className={styles.uploadImgInside}
                                onChange={handleUploadImgProfile}
                                title=""
                            />
                        </div>
                        <p className={styles.dragText}>Ou arraste uma imagem para enviar</p>
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
                <div className={styles.userImgButtons}>
                    <IconButton color='neutral' aria-label="cropImg">
                        <CropIcon />
                    </IconButton>
                    <IconButton color='neutral' aria-label="infoImg">
                        <InfoIcon />
                    </IconButton>
                    <IconButton color='neutral' onClick={deleteProfileImg} aria-label="deleteImg">
                        <DeleteForeverIcon />
                    </IconButton>
                </div>
            }
        </div>
    )
}
