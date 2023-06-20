import { useEffect, useRef, useState } from 'react';
import styles from '../styles/components/QuestionField.module.css'
import $ from 'jquery'

const FAST_ANIMATION = 'all ease 0ms'

export default function QuestionField(props) {

    const {
        variant,
        colorValue,
        value,
        disabled,
        borderRadius,
        placeholder,
        onChange,
        textColor,
        editQuestionMode,
    } = props

    const containerRef = useRef(null)

    const [containerSize, setContainerSize] = useState({
        width: $(`.${styles.container}`).width(),
        height: $(`.${styles.container}`).height()
    })
    const [color, setColor] = useState(colorValue)
    const [isFocused, setIsFocused] = useState(false);
    const [animation, setAnimation] = useState('all ease 0ms')


    useEffect(() => {
        if (colorValue.length === 5)
            setColor(colorValue.slice(0, 4))
        else
            setColor(colorValue)
    }, [colorValue])

    const INPUT_VARIANTS = new Map([
        ['text', {
            color: value === '' && !isFocused && placeholder ? color.concat('90') : color,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
        }],
        ['shadow', {
            color: value === '' && !isFocused && placeholder ? color.concat('90') : color,
            borderColor: 'transparent',
            backgroundColor: color.concat('0a'),
        }],
        ['outlined', {
            color: value === '' && !isFocused && placeholder ? color.concat('90') : color,
            borderColor: color,
            backgroundColor: color.concat('0a'),
        }],
        ['contained', {
            color: value === '' && !isFocused && placeholder ? textColor.concat('90') : textColor,
            backgroundColor: color,
            boxShadow: '0px 3px 20px -15px',
            borderColor: 'transparent',
        }],
    ])

    useEffect(() => {

        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight
        })

        setTimeout(() => {
            setAnimation('all ease 200ms')
        }, 50)

        function handleResize() {
            setContainerSize({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }

        $(window).on('resize', handleResize)

        return () => {
            $(window).off('resize', handleResize)
        }
    }, [])

    function handleFocus() {
        setIsFocused(true)
    }

    function handleBlur() {
        setIsFocused(false)
    }

    return (
        <div
            className={styles.container}
            ref={containerRef}
        >
            <input
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={styles.input}
                style={{
                    transition: editQuestionMode ? FAST_ANIMATION : animation,
                    borderStyle: 'solid',
                    borderWidth: containerSize ? `${containerSize.height * 0.026}px` : '0px',
                    fontWeight: 'bold',
                    fontSize: containerSize ? `${containerSize.height * 0.6}px` : '0px',
                    borderRadius: containerSize ? `${containerSize.height * borderRadius * 0.005}px` : '4px',
                    ...INPUT_VARIANTS.get(variant),
                }}
                disabled={disabled}
                value={value === '' && !isFocused && placeholder ? placeholder : value}
                type='text'
                onChange={onChange}
                autoComplete='off'
                spellCheck={false}
            />
        </div>
    )
}