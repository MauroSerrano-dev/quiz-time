import { useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

const SIZES = new Map([
    ['medium', { width: '250px', height: '50px' }]
])

const SYMBOL_SIZES = new Map([
    ['medium', { width: '35px', height: '35px' }]
])

export default function OptionInput(props) {
    const {
        text,
        size = 'medium',
        color
    } = props
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseEnter() {
        setIsHovered(true)
    }

    function handleMouseLeave() {
        setIsHovered(false)
    }

    return (
        <button
            className={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                ...SIZES.get(size),
                outlineColor: isHovered ? color : color.concat('80'),
                backgroundColor: isHovered ? color.concat('0a') : 'transparent',
            }}
        >
            <div className={styles.symbolContainer}>
                {/* <GroupAddIcon sx={{ color: 'white' }} /> */}
                <div
                    className={styles.symbol}
                    style={{...SYMBOL_SIZES.get(size), backgroundColor: color}}
                >
                    <h2>A</h2>
                </div>
            </div>
            <div className={styles.text}>
                {text}
            </div>
        </button>
    )
}
