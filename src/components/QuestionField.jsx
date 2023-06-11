import styles from '../styles/components/QuestionField.module.css'

export default function QuestionField(props) {

    const {

    } = props

    return (
        <div className={styles.container}>
            <input
                className={styles.input}
                type='text'
                autoComplete='off'
            />
        </div>
    )
}
