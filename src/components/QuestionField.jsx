import { useEffect, useState } from 'react';
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
        slideMode,
    } = props

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
            color: value === '' && !isFocused ? color.concat('90') : color,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
        }],
        ['shadow', {
            color: value === '' && !isFocused ? color.concat('90') : color,
            borderColor: 'transparent',
            backgroundColor: color.concat('0a'),
        }],
        ['outlined', {
            color: value === '' && !isFocused ? color.concat('90') : color,
            borderColor: color.concat('c0'),
            backgroundColor: color.concat('0a'),
        }],
        ['contained', {
            color: textColor,
            backgroundColor: color,
            boxShadow: '0px 3px 20px -15px',
            borderColor: 'transparent',
        }],
    ])

    useEffect(() => {
        setTimeout(() => {
            setContainerSize({
                width: $(`.${slideMode ? styles.containerSlide : styles.container}`).width(),
                height: $(`.${slideMode ? styles.containerSlide : styles.container}`).height()
            })
        }, 1)

        setTimeout(() => {
            setAnimation('all ease 200msms')
        }, 200)

        function handleResize() {
            setContainerSize({
                width: $(`.${slideMode ? styles.containerSlide : styles.container}`).width(),
                height: $(`.${slideMode ? styles.containerSlide : styles.container}`).height()
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    return (
        <div
            className={`${slideMode
                ? styles.containerSlide
                : styles.container
                }`
            }
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
                value={value === '' && !isFocused ? placeholder : value}
                type='text'
                autoComplete='off'
                onChange={onChange}
                spellCheck={false}
            />
        </div>
    )
}