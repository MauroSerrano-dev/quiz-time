import { useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

const SIZES = new Map([
    ['medium', {
        width: 500,
        height: 100
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
            backgroundColor: '#1c222c',
        }],
    ])

    const SYMBOL_TEXT_VARIANTS = new Map([
        ['outlined', {
        }],
        ['contained', {
            color: isHovered ? color.concat('85') : color,
        }],
    ])

    const TEXT_VARIANTS = new Map([
        ['outlined', {
            color: color,
        }],
        ['contained', {
            color: '#1c222c',
            fontSize: `${SIZES.get(size) * 50}px`
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
                transition: 'all ease 200ms',
                ...BUTTON_VARIANTS.get(variant)
            }}
        >
            <div className={styles.symbolContainer}>
                <div
                    className={styles.symbol}
                    style={{
                        width: `${SIZES.get(size).height * 0.65}px`,
                        height: `${SIZES.get(size).height * 0.65}px`,
                        ...SYMBOL_VARIANTS.get(variant)
                    }}
                >
                    <h2
                        style={{
                            ...SYMBOL_TEXT_VARIANTS.get(variant),
                            transition: 'all ease 200ms',
                            fontSize: `${SIZES.get(size).width * 0.08}px`
                        }}
                    >
                        {symbol}
                    </h2>
                </div>
            </div>
            <div className={styles.textContainer}>
                <p
                    style={{
                        ...TEXT_VARIANTS.get(variant),
                        fontSize: `${SIZES.get(size).width * 0.065}px`
                    }}
                >
                    {text}
                </p>
            </div>
        </button>
    )
}
