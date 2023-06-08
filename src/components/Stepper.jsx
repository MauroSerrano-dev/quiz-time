import styles from '@/styles/components/Stepper.module.css'
import Step from './Step'

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
        placeholderPathStyle,
    } = props

    function handleChangeStep(index) {
        if (setCurrentStep)
            setCurrentStep(index)
    }

    return (
        <div style={{ ...containerStyle }} className={styles.container}>
            <div className={styles.incompleteContainer}>
                {steps.map((icon, i) =>
                    <div key={i} className={styles.stepPath}>
                        {i !== 0 &&
                            <div
                                className={styles.path}
                                style={{ ...pathSize, ...placeholderPathStyle }}
                            >
                            </div>
                        }
                        <Step
                            icon={icon}
                            click={() => handleChangeStep(i)}
                            stepStyle={{ ...stepSize, ...placeholderStepStyle }}
                            label={labels[i]}
                            labelStyle={{ color: i <= currentStep ? textColor : '#616161', ...labelStyle }}
                        />
                    </div>
                )}
            </div>
            <div
                className={styles.completeContainer}
                style={{
                    width: `${currentStep * Number(stepSize.width.split('p')[0]) + currentStep * Number(pathSize.width.split('p')[0]) + Number(stepSize.width.split('p')[0])}px`,
                }}
            >
                {steps.map((icon, i) =>
                    <div
                        key={i}
                        className={styles.stepPath}
                    >
                        {i !== 0 &&
                            <div
                                className={styles.path}
                                style={{ ...pathSize, ...pathStyle }}
                            >
                            </div>
                        }
                        <Step
                            icon={icon}
                            click={() => handleChangeStep(i)}
                            stepStyle={{ ...stepSize, ...stepStyle }}
                            label={labels[i]}
                            labelStyle={labelStyle}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}