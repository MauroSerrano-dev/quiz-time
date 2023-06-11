import { useEffect, useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'
import { BorderColor } from '@mui/icons-material'

const SIZES = new Map([
    [
        'responsive', {
            height: 120
        }
    ],
    [
        'medium', {
            width: 300,
            height: 60
        }
    ]
])

const BUTTON_ANIMATION = 'all ease 200ms'

export default function OptionInput(props) {

    const {
        index,
        text,
        size = 'medium',
        color,
        symbol,
        variant,
    } = props

    const [isHovered, setIsHovered] = useState(false);
    const [buttonSize, setButtonSize] = useState();

    useEffect(() => {
        setButtonSize({
            width: document.getElementsByClassName(styles.button)[index].offsetWidth,
            height: document.getElementsByClassName(styles.button)[index].offsetHeight,
        })

        function handleResize() {
            setButtonSize({
                width: document.getElementsByClassName(styles.button)[index].offsetWidth,
                height: document.getElementsByClassName(styles.button)[index].offsetHeight,
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const BUTTON_VARIANTS = new Map([
        ['outlined', {
            outlineStyle: 'solid',
            outlineWidth: '2px',
            outlineColor: isHovered ? color : color.concat('c0'),
            backgroundColor: isHovered ? color.concat('25') : color.concat('0a'),
        }],
        ['contained', {
            backgroundColor: isHovered ? color.concat('c0') : color,
            boxShadow: isHovered ? '0px 3px 25px -10px' : '0px 3px 20px -15px'
        }],
    ])

    const SYMBOL_VARIANTS = new Map([
        ['outlined', {
            outlineStyle: 'solid',
            outlineWidth: '2px',
            outlineColor: isHovered ? color : color.concat('c0'),
        }],
        ['contained', {
            backgroundColor: '#1c222c',
            borderRight: 'solid 1px black'
        }],
    ])

    const SYMBOL_TEXT_VARIANTS = new Map([
        ['outlined', {
            color: color,
        }],
        ['contained', {
            color: isHovered ? color.concat('c0') : color,
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
                width: size === 'responsive' ? '50%' : `${SIZES.get(size).width}px`,
                height: size === 'responsive' ? '100%' : `${SIZES.get(size).height}px`,
                transition: BUTTON_ANIMATION,
                ...BUTTON_VARIANTS.get(variant)
            }}
        >
            {buttonSize &&
                <div className={styles.contentContainer}>
                    <div className={styles.symbolContainer}>
                        <div
                            className={styles.symbol}
                            style={{
                                width: `${buttonSize.height * 0.4}px`,
                                height: `${buttonSize.height * 0.4}px`,
                                transition: BUTTON_ANIMATION,
                                ...SYMBOL_VARIANTS.get(variant)
                            }}
                        >
                            <h2
                                style={{
                                    ...SYMBOL_TEXT_VARIANTS.get(variant),
                                    transition: BUTTON_ANIMATION,
                                    fontSize: `${buttonSize.height * 0.3}px`
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
                                fontSize: `${buttonSize.height * 0.3}px`
                            }}
                        >
                            {text}
                        </p>
                    </div>
                </div>
            }
        </button>
    )
}
