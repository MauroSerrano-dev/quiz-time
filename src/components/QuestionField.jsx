import { useEffect, useState } from 'react';
import styles from '../styles/components/QuestionField.module.css'

const ANIMATION = 'all ease 200ms'

export default function QuestionField(props) {

    const {
        variant,
        color,
        index,
        value,
        disabled,
    } = props
    const [containerSize, setContainerSize] = useState()

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
                borderWidth: containerSize ? `${containerSize.height * 0.026}px` : '3px',
                fontWeight: 'bold',
                ...CONTAINER_VARIANTS.get(variant)
            }}
            disabled={disabled}
            value={value}
            type='text'
            autoComplete='off'
        />
    )
}
