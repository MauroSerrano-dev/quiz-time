import { useEffect, useRef, useState } from 'react'
import styles from '../styles/components/OptionInput.module.css'
import $ from 'jquery'

import { BsTriangleFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import PentagonRoundedIcon from '@mui/icons-material/PentagonRounded';
import HexagonRoundedIcon from '@mui/icons-material/HexagonRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

const TEXT_LIMIT = 80

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
    [0, { letter: 'A', color: '#26890c', polygon: 'triangle' }],
    [1, { letter: 'B', color: '#e21b3c', polygon: 'circle' }],
    [2, { letter: 'C', color: '#e7b509', polygon: 'square' }],
    [3, { letter: 'D', color: '#1368ce', polygon: 'x' }],
    [4, { letter: 'E', color: '#3dd5c5', polygon: 'pentagon' }],
    [5, { letter: 'F', color: '#f26e00', polygon: 'hexagon' }],
])

const FAST_ANIMATION = 'all ease 0ms'

const BORDER_WIDTH = 0.024

export default function OptionInput(props) {

    const {
        state = 'default',
        option,
        text,
        size = 'medium',
        colorValue = OPTIONS.get(option).color,
        symbol,
        variant,
        noSymbol,
        symbolColor,
        textColor,
        borderRadius,
        attSizeRef,
        editMode,
        onChange,
        placeholder,
        inputMode,
        onClick,
        width,
        height,
        hideText,
    } = props

    const containerRef = useRef(null)
    const inputTextRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)
    const [color, setColor] = useState(colorValue)
    const [animation, setAnimation] = useState(FAST_ANIMATION)
    const [isFocused, setIsFocused] = useState(false)
    const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 })

    const supportsHoverAndPointer = window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches;

    useEffect(() => {
        setButtonSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight
        })

        const divElement = inputTextRef.current
        divElement.innerText = text === '' && placeholder ? placeholder : text
        removeFocusFromAllElements()
    }, [attSizeRef])

    useEffect(() => {
        const divElement = inputTextRef.current
        divElement.innerText = text === '' && placeholder ? placeholder : text
    }, [text])


    useEffect(() => {

        setTimeout(() => {
            setAnimation('all ease 200ms')
        }, 50)

        function handleResize() {
            setButtonSize({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }

        $(window).on('resize', handleResize)

        return () => {
            $(window).off('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        if (colorValue.length === 5)
            setColor(colorValue.slice(0, 4))
        else
            setColor(colorValue)
    }, [colorValue])

    const BUTTON_STATE = new Map([
        ['default', {}],
        ['chosen', {

        }],
        ['notChosen', {
            opacity: 0.5,
        }],
    ])

    const BUTTON_VARIANTS = new Map([
        ['outlined', {
            borderColor: color,
            backgroundColor: isHovered && supportsHoverAndPointer
                ? color.concat('25')
                : color.concat('0a'),
        }],
        ['contained', {
            borderColor: 'transparent',
            backgroundColor: isHovered && supportsHoverAndPointer
                ? color.concat('c0')
                : color,
            boxShadow: isHovered && supportsHoverAndPointer
                ? '0px 3px 25px -10px'
                : '0px 3px 20px -15px'
        }],
    ])

    const COUNTER_VARIANTS = new Map([
        ['outlined', {
            color: color,
        }],
        ['contained', {
            color: symbolColor,
        }],
    ])

    const SYMBOL_POLYGONS = new Map([
        ['triangle',
            <BsTriangleFill
                size='100%'
                color={variant === 'contained' ? symbolColor : color}
                style={{
                    position: 'absolute',
                    transition: editMode ? animation : FAST_ANIMATION,
                }}
            />
        ],
        ['circle',
            <CircleRoundedIcon
                style={{
                    position: 'absolute',
                    transition: editMode ? animation : FAST_ANIMATION,
                    width: '120%',
                    height: '120%',
                    color: variant === 'contained'
                        ? symbolColor
                        : symbol === 'letters'
                            ? 'transparent'
                            : color
                }}
            />

        ],
        ['square',
            <SquareRoundedIcon
                style={{
                    position: 'absolute',
                    transition: editMode
                        ? animation
                        : FAST_ANIMATION,
                    width: '120%',
                    height: '120%',
                    color: variant === 'contained'
                        ? symbolColor
                        : color
                }}
            />
        ],
        ['x',
            <IoClose
                size='100%'
                color={variant === 'contained'
                    ? symbolColor
                    : color
                }
                style={{
                    position: 'absolute',
                    transition: editMode
                        ? animation
                        : FAST_ANIMATION,
                    strokeWidth: '45px',
                    width: '145%',
                    height: '145%',
                }}
            />
        ],
        ['pentagon',
            <PentagonRoundedIcon
                style={{
                    position: 'absolute',
                    transition: editMode
                        ? animation
                        : FAST_ANIMATION,
                    width: '120%',
                    height: '120%',
                    color: variant === 'contained'
                        ? symbolColor
                        : color
                }}
            />
        ],
        ['hexagon',
            <HexagonRoundedIcon
                style={{
                    position: 'absolute',
                    transition: editMode
                        ? animation
                        : FAST_ANIMATION,
                    width: '120%',
                    height: '120%',
                    color: variant === 'contained'
                        ? symbolColor
                        : color
                }}
            />
        ],
    ])

    const SYMBOL_VARIANTS = new Map([
        ['outlined', {
            outlineColor: symbol === 'polygons'
                ? 'transparent'
                : isHovered && supportsHoverAndPointer
                    ? color
                    : color.concat('c0'),
            borderRadius: symbol === 'polygons'
                ? '0px'
                : '100%'
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
            color: isHovered && supportsHoverAndPointer
                ? color.concat('c0')
                : color,
        }],
    ])

    const TEXT_VARIANTS = new Map([
        ['outlined', {
            color: hideText
                ? color.concat('00')
                : text === '' && !isFocused && placeholder
                    ? color.concat('90')
                    : color,
        }],
        ['contained', {
            color: hideText
                ? textColor.concat('00')
                : text === '' && !isFocused && placeholder
                    ? textColor.concat('90')
                    : textColor,
        }],
    ])

    function handleMouseEnter() {
        setIsHovered(true)
    }

    function handleMouseLeave() {
        setIsHovered(false)
    }

    function handleFocus(e) {
        if (inputMode) {
            inputTextRef.current.innerText = text
        }
        setIsFocused(true)
    }

    function handleBlur() {
        if (inputMode) {
            inputTextRef.current.innerText = text === '' && placeholder ? placeholder : text
        }
        setIsFocused(false)
    }

    function handleInput(e) {
        const inputValue = e.target.innerText

        const divElement = inputTextRef.current
        if (inputValue.length > TEXT_LIMIT) {
            e.target.innerText = text.length === TEXT_LIMIT
                ? text
                : e.target.innerText.slice(0, TEXT_LIMIT)
            const range = document.createRange()
            const selection = window.getSelection()
            range.selectNodeContents(divElement)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
        }

        onChange(e.target.innerText);
    }

    function removeFocusFromAllElements() {
        const focusedElement = document.activeElement
        if (focusedElement) {
            focusedElement.blur()
        }
    }

    return (
        <button
            tabIndex={inputMode ? '-1' : '0'}
            ref={containerRef}
            className={styles.button}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick ? onClick : undefined}
            style={{
                width: width !== undefined
                    ? width
                    : size === 'responsive'
                        ? '50%'
                        : `${SIZES.get(size).width}px`,
                height: height !== undefined
                    ? height
                    : size === 'responsive'
                        ? '100%'
                        : `${SIZES.get(size).height}px`,
                transition: animation,
                borderStyle: 'solid',
                borderWidth: `${buttonSize.height * BORDER_WIDTH}px`,
                borderRadius: `${buttonSize.height * borderRadius * 0.005}px`,
                ...BUTTON_VARIANTS.get(variant),
                ...BUTTON_STATE.get(state),
            }}
        >
            <div className={styles.symbolContainer}
                style={{
                    transition: editMode ? animation : FAST_ANIMATION,
                    width: symbol === 'none'
                        ? '0px'
                        : `${buttonSize.height * 0.38}px`,
                    height: symbol === 'none'
                        ? '0px'
                        : '100%',
                }}
            >
                {!noSymbol &&
                    <div
                        className={styles.symbol}
                        style={{
                            position: 'relative',
                            width: symbol === 'none'
                                ? '0px'
                                : `${buttonSize.height * 0.38}px`,
                            height: symbol === 'none'
                                ? '0px'
                                : `${buttonSize.height * 0.38}px`,
                            transition: editMode ? animation : FAST_ANIMATION,
                            outlineStyle: 'solid',
                            outlineWidth: symbol === 'none'
                                ? '0px'
                                : `${buttonSize.height * BORDER_WIDTH}px`,
                            ...SYMBOL_VARIANTS.get(variant),
                            backgroundColor: 'transparent',
                            fontSize: symbol === 'none'
                                ? '0px'
                                : `${buttonSize.height * 0.27}px`
                        }}
                    >
                        {SYMBOL_POLYGONS.get(symbol === 'polygons'
                            ? OPTIONS.get(option).polygon
                            : 'circle'
                        )}
                        <h2
                            style={{
                                ...SYMBOL_TEXT_VARIANTS.get(variant),
                                transition: editMode ? animation : FAST_ANIMATION,
                                position: 'absolute',
                                fontSize: symbol === 'letters'
                                    ? `${buttonSize.height * 0.3}px`
                                    : '0px',
                            }}
                        >
                            {OPTIONS.get(option).letter}
                        </h2>
                    </div>
                }
            </div>
            <div
                className={styles.textContainer}
                style={{
                    transition: editMode ? animation : FAST_ANIMATION,
                    width: `calc(88% - ${symbol === 'none'
                        ? 0
                        : buttonSize.height * 0.38}px)`
                }}
            >
                <div
                    className={styles.textInput}
                    ref={inputTextRef}
                    contentEditable={inputMode}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                        ...TEXT_VARIANTS.get(variant),
                        fontSize: `${buttonSize.height * 0.19}px`,
                        transition: animation,
                        cursor: inputMode ? 'text' : 'pointer',
                        paddingTop: text === '' && isFocused
                            ? `${(buttonSize.height / 2) - (buttonSize.height * 0.19 / 2) - (buttonSize.height * 0.024 / 2)}px`
                            : '0px',
                    }}
                    onInput={handleInput}
                    spellCheck={false}
                >
                </div>
            </div>
            {inputMode && isFocused &&
                <h4
                    className={styles.characterCounter}
                    style={{
                        ...COUNTER_VARIANTS.get(variant),
                        right: `${buttonSize.height * 0.1}px`,
                        top: `${buttonSize.height * 0.1}px`,
                        fontSize: `${buttonSize.height * 0.13}px`,
                    }}
                >
                    {TEXT_LIMIT - text.length}
                </h4>
            }
        </button>
    )
}