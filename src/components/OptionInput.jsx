import { useEffect, useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'

import { BsTriangleFill } from "react-icons/bs";
import { BsCircleFill } from "react-icons/bs";
import { FaSquare } from "react-icons/fa";
import { motion } from "framer-motion"

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

const OPTIONS = new Map([
    [0, { letter: 'A', color: '#237e0b', polygon: 'triangle' }],
    [1, { letter: 'B', color: '#d01937', polygon: 'circle' }],
    [2, { letter: 'C', color: '#e7b509', polygon: 'square' }],
    [3, { letter: 'D', color: '#1260be', polygon: 'x' }],
])

const ANIMATION = 'all ease 200ms'

export default function OptionInput(props) {

    const {
        option,
        index,
        text,
        size = 'medium',
        colorValue = OPTIONS.get(option).color,
        symbol,
        variant,
        noSymbol,
        symbolColor,
        textColor,
        borderRadius,
    } = props

    const [isHovered, setIsHovered] = useState(false)
    const [buttonSize, setButtonSize] = useState()
    const [color, setColor] = useState(colorValue)

    useEffect(() => {
        if (colorValue.length === 5)
            setColor(colorValue.slice(0, 4))
        else
            setColor(colorValue)
    }, [colorValue])

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
            borderColor: isHovered ? color : color.concat('c0'),
            backgroundColor: isHovered ? color.concat('25') : color.concat('0a'),
        }],
        ['contained', {
            borderColor: 'transparent',
            backgroundColor: isHovered ? color.concat('c0') : color,
            boxShadow: isHovered ? '0px 3px 25px -10px' : '0px 3px 20px -15px'
        }],
    ])

    const SYMBOL_POLYGONS = new Map([
        ['triangle',
            <BsTriangleFill
                size='100%'
                color={variant === 'contained' ? symbolColor : color}
                style={{
                    position: 'absolute',
                    transition: ANIMATION,
                }}
            />
        ],
        ['circle',
            <BsCircleFill
                size='100%'
                color={variant === 'contained'
                    ? symbolColor
                    : symbol === 'letters'
                        ? 'transparent'
                        : color}
                style={{
                    position: 'absolute',
                    transition: ANIMATION,
                }}
            />
        ],
        ['square',
            <FaSquare
                size='100%'
                color={variant === 'contained' ? symbolColor : color}
                style={{
                    position: 'absolute',
                    transition: ANIMATION,
                }} />
        ],
        ['x',
            <h1
                style={{
                    color: variant === 'contained' ? symbolColor : color,
                    MozUserSelect: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
                    transition: 'color ease 200ms',
                }} >
                X
            </h1>
        ],
    ])

    const SYMBOL_VARIANTS = new Map([
        ['outlined', {
            outlineColor: symbol === 'polygons'
                ? 'transparent'
                : isHovered
                    ? color
                    : color.concat('c0'),
            borderRadius: symbol === 'polygons' ? '0px' : '100%'
        }],
        ['contained', {
            outlineColor: 'transparent',
            backgroundColor: symbolColor,
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
            color: textColor,
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
                transition: ANIMATION,
                borderStyle: 'solid',
                borderWidth: buttonSize ? `${buttonSize.height * 0.024}px` : '3px',
                borderRadius: buttonSize ? `${buttonSize.height * borderRadius * 0.005}px` : '4px',
                ...BUTTON_VARIANTS.get(variant)
            }}
        >
            {buttonSize &&
                <div className={styles.contentContainer}>
                    <div className={styles.symbolContainer}
                        style={{
                            paddingRight: symbol === 'none' ? '0px' : '5%',
                        }}
                    >
                        {!noSymbol &&
                            <div
                                className={styles.symbol}
                                style={{
                                    position: 'relative',
                                    width: symbol === 'none' ? '0px' : `${buttonSize.height * 0.4}px`,
                                    height: symbol === 'none' ? '0px' : `${buttonSize.height * 0.4}px`,
                                    transition: ANIMATION,
                                    outlineStyle: 'solid',
                                    outlineWidth: symbol === 'none' ? '0px' : (buttonSize ? `${buttonSize.height * 0.026}px` : '3px'),
                                    ...SYMBOL_VARIANTS.get(variant),
                                    backgroundColor: 'transparent',
                                    fontSize: symbol === 'none'
                                        ? '0px'
                                        : buttonSize
                                            ? `${buttonSize.height * 0.27}px`
                                            : '20px',
                                }}
                            >
                                {SYMBOL_POLYGONS.get(symbol === 'polygons'
                                    ? OPTIONS.get(option).polygon
                                    : 'circle'
                                )}
                                <h2
                                    style={{
                                        ...SYMBOL_TEXT_VARIANTS.get(variant),
                                        transition: ANIMATION,
                                        position: 'absolute',
                                        fontSize: symbol === 'letters' ? `${buttonSize.height * 0.3}px` : '0px',
                                    }}
                                >
                                    {OPTIONS.get(option).letter}
                                </h2>
                            </div>
                        }
                    </div>
                    <div className={styles.textContainer}>
                        <p
                            style={{
                                ...TEXT_VARIANTS.get(variant),
                                fontSize: `${buttonSize.height * 0.3}px`,
                                transition: ANIMATION,
                            }}
                        >
                            {text}
                        </p>
                    </div>
                </div>
            }
        </button >
    )
}