import styles from '@/styles/components/Stepper.module.css'

export default function Stepper(props) {
    const {
        steps,
        stepSize,
        pathSize,
        stepStyle,
        pathStyle,
        labels,
        textColor,
        currentStep,
        setCurrentStep,
        labelStyle,
        containerStyle,
        placeholderStepStyle,
        infoMode
    } = props

    function handleChangeStep(index) {
        if (!infoMode)
            setCurrentStep(index)
    }

    return (
        <div style={{ ...containerStyle }} className={styles.container}>
            <div className={styles.incompleteContainer}>
                {steps.map((step, i) =>
                    <div key={i} className={styles.stepPath}>
                        {i !== 0 &&
                            <div
                                className={styles.path}
                                style={{ ...pathSize }}
                            >
                            </div>
                        }
                        <div
                            className={styles.step}
                            style={{ ...stepSize, ...placeholderStepStyle }}
                            onClick={() => handleChangeStep(i)}
                        >
                            {step}
                            <h4
                                style={{
                                    color: currentStep >= i ? textColor : '#616161',
                                    ...labelStyle
                                }}
                                className={styles.labels}>
                                {labels[i]}
                            </h4>
                        </div>
                    </div>
                )}
            </div>
            <div
                className={styles.completeContainer}
                style={{
                    width: infoMode ? '100%' : `${currentStep * Number(stepSize.width.split('p')[0]) + currentStep * Number(pathSize.width.split('p')[0]) + Number(stepSize.width.split('p')[0])}px`,
                }}
            >
                {steps.map((step, i) =>
                    <div key={i} className={styles.stepPath}>
                        {i !== 0 &&
                            <div
                                className={styles.path}
                                style={{ ...pathSize, ...pathStyle }}
                            >
                            </div>
                        }
                        <div
                            className={styles.step}
                            style={{ ...stepSize, ...stepStyle }}
                            onClick={() => handleChangeStep(i)}
                        >
                            {step}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}