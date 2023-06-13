import { TextField } from '@mui/material'
import styles from '../styles/components/ColorInput.module.css'
import { useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { motion } from "framer-motion"

export default function ColorInput(props) {
    const {
        onChange,
        value,
        upPosition,
        customLabel = 'Cor'
    } = props

    const [isFocused, setIsFocused] = useState(false);


    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    return (
        <div
            className={styles.container}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <TextField
                onChange={onChange}
                variant='outlined'
                label={customLabel}
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
            {isFocused &&
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