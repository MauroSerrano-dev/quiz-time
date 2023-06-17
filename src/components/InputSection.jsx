import styles from '../styles/components/InputSection.module.css'

export default function InputSection(props) {
    const {
        title,
        icon,
        body,
    } = props

    return (
        <div className={styles.container}>
            <div className='flex row start size100' style={{ gap: '3%' }}>
                {icon}
                <h4 className={styles.inputLabel}>
                    {title}
                </h4>
            </div>
            {body}
        </div>
    )
}
