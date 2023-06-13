import { useEffect, useState } from 'react';
import styles from '../styles/components/QuestionField.module.css'
import $ from 'jquery'

const ANIMATION = 'all ease 200ms'

export default function QuestionField(props) {

    const {
        variant,
        colorValue,
        index,
        value,
        disabled,
        borderRadius,
        placeholder,
        onChange,
        textColor,
    } = props
    const [containerSize, setContainerSize] = useState()
    const [color, setColor] = useState(colorValue)


    useEffect(() => {
        if (colorValue.length === 5)
            setColor(colorValue.slice(0, 4))
        else
            setColor(colorValue)
    }, [colorValue])

    const INPUT_VARIANTS = new Map([
        ['text', {
            color: color,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
        }],
        ['shadow', {
            color: color,
            borderColor: 'transparent',
            backgroundColor: color.concat('0a'),
        }],
        ['outlined', {
            color: color,
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
        setContainerSize({
            width: document.getElementsByClassName(styles.container)[index].offsetWidth,
            height: document.getElementsByClassName(styles.container)[index].offsetHeight,
        })

        function handleResize() {
            setContainerSize({
                width: document.getElementsByClassName(styles.container)[index].offsetWidth,
                height: document.getElementsByClassName(styles.container)[index].offsetHeight,
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className={styles.container}>
            {containerSize &&
                <input
                    className={styles.input}
                    style={{
                        transition: ANIMATION,
                        borderStyle: 'solid',
                        borderWidth: containerSize ? `${containerSize.height * 0.026}px` : '0px',
                        fontWeight: 'bold',
                        fontSize: containerSize ? `${containerSize.height * 0.6}px` : '0px',
                        borderRadius: containerSize ? `${containerSize.height * borderRadius * 0.005}px` : '4px',
                        ...INPUT_VARIANTS.get(variant),
                    }}
                    disabled={disabled}
                    value={value}
                    type='text'
                    autoComplete='off'
                    placeholder={placeholder}
                    onChange={onChange}
                    spellCheck={false}
                />
            }
        </div>
    )
}