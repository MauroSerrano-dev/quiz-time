import { useEffect, useState } from 'react';
import styles from '../styles/components/QuestionField.module.css'

const ANIMATION = 'all ease 200ms'

export default function QuestionField(props) {

    const {
        variant,
        colorValue,
        index,
        value,
        disabled,
    } = props
    const [containerSize, setContainerSize] = useState()
    const [color, setColor] = useState(colorValue)

    useEffect(() => {
        if (colorValue.length === 5)
            setColor(colorValue.slice(0, 4))
        else
            setColor(colorValue)
    }, [colorValue])

    const CONTAINER_VARIANTS = new Map([
        ['text', {
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
            color: '#1c222c',
            backgroundColor: color,
            boxShadow: '0px 3px 20px -15px',
            borderColor: 'transparent',
        }],
    ])

    useEffect(() => {
        console.log(containerSize)
    }, [containerSize])

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
        <input
            className={styles.container}
            style={{
                transition: ANIMATION,
                borderStyle: 'solid',
                borderWidth: containerSize ? `${containerSize.height * 0.026}px` : '0px',
                fontWeight: 'bold',
                fontSize: containerSize ? `${containerSize.height * 0.6}px` : '0px',
                ...CONTAINER_VARIANTS.get(variant)
            }}
            disabled={disabled}
            value={value}
            type='text'
            autoComplete='off'
        />
    )
}