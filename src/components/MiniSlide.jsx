
import styles from '../styles/components/MiniSlide.module.css'

export default function MiniSlide(props) {
    const { name } = props

    return (
        <div id={styles.container}>
            <h2>{name}</h2>
        </div>
    )
}