import { useEffect, useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'

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

const SYMBOLS = new Map([
    [0, { letter: 'A' }],
    [1, { letter: 'B' }],
    [2, { letter: 'C' }],
    [3, { letter: 'D' }],
    [4, { letter: 'A' }],
    [5, { letter: 'B' }],
    [6, { letter: 'C' }],
    [7, { letter: 'D' }],
    [8, { letter: 'A' }],
    [9, { letter: 'B' }],
    [10, { letter: 'C' }],
    [11, { letter: 'D' }],
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
            outlineWidth: symbol === 'letters' ? '2px' : '0px',
            outlineColor: isHovered ? color : color.concat('c0'),
        }],
        ['contained', {
            backgroundColor: '#1c222c',
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
                                width: symbol === 'letters' ? `${buttonSize.height * 0.4}px` : '0px',
                                height: symbol === 'letters' ? `${buttonSize.height * 0.4}px` : '0px',
                                transition: BUTTON_ANIMATION,
                                ...SYMBOL_VARIANTS.get(variant)
                            }}
                        >
                            <h2
                                style={{
                                    ...SYMBOL_TEXT_VARIANTS.get(variant),
                                    transition: BUTTON_ANIMATION,
                                    fontSize: symbol === 'letters' ? `${buttonSize.height * 0.3}px` : '0px'
                                }}
                            >
                                {SYMBOLS.get(index).letter}
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
