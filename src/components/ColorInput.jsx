import { TextField } from '@mui/material'
import styles from '../styles/components/ColorInput.module.css'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { motion } from "framer-motion"

export default function ColorInput(props) {
    const {
        onChange,
        value,
        upPosition
    } = props

    const [isHovered, setIsHovered] = useState(false)

    function handleMouseEnter() {
        setIsHovered(true)
    }

    function handleMouseLeave() {
        setIsHovered(false)
    }

    return (
        <div
            className={styles.container}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <TextField
                onChange={onChange}
                variant='outlined'
                label='Cor'
                value={value}
                size='small'
                sx={{
                    width: '100%',
                }}
                autoComplete='off'
            />
            <div
                className={styles.colorSample}
                style={{
                    backgroundColor: value
                }}
            >
            </div>
            {isHovered &&
                <motion.div
                    className={styles.colorPickerContainer}
                    style={{ bottom: upPosition ? '39px' : '-170px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <HexColorPicker
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                        }}
                        onChange={onChange}
                        color={value}
                    />
                </motion.div>
            }
        </div>
    )
}