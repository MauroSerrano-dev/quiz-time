import { useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

const SIZES = new Map([
    ['medium', {
        width: 250,
        height: 50
    }]
])

export default function OptionInput(props) {

    const {
        text,
        size = 'medium',
        color,
        symbol,
        variant
    } = props

    const [isHovered, setIsHovered] = useState(false);

    const BUTTON_VARIANTS = new Map([
        ['outlined', {
            outlineColor: isHovered ? color : color.concat('80'),
            backgroundColor: isHovered ? color.concat('0a') : 'transparent',
        }],
        ['contained', {
            outline: 'none',
            backgroundColor: isHovered ? color.concat('85') : color,
            boxShadow: isHovered ? '0px 3px 25px -10px' : '0px 3px 20px -15px'
        }],
    ])

    const SYMBOL_VARIANTS = new Map([
        ['outlined', {
            backgroundColor: color
        }],
        ['contained', {
            backgroundColor: isHovered ? '#ffffff85' : '#ffffff',
        }],
    ])

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
                width: `${SIZES.get(size).width}px`,
                height: `${SIZES.get(size).height}px`,
                ...BUTTON_VARIANTS.get(variant)
            }}
        >
            <div className={styles.symbolContainer}>
                {/* <GroupAddIcon sx={{ color: 'white' }} /> */}
                <div
                    className={styles.symbol}
                    style={{
                        width: `${SIZES.get(size).height * 0.65}px`,
                        height: `${SIZES.get(size).height * 0.65}px`,
                        ...SYMBOL_VARIANTS.get(variant)
                    }}
                >
                    <h2>{symbol}</h2>
                </div>
            </div>
            <div className={styles.text}>
                {text}
            </div>
        </button>
    )
}
