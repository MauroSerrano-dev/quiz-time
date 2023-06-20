import styles from '@/styles/components/Step.module.css'

export default function Step(props) {
    const {
        icon,
        click,
        stepStyle,
        label,
        labelStyle,
    } = props

    return (
        <div
            className={styles.step}
            style={stepStyle}
            onClick={click}
        >
            {icon}
            {label &&
                <h4
                    style={{
                        ...labelStyle
                    }}
                    className={styles.labels}>
                    {label}
                </h4>
            }
        </div>
    )
}