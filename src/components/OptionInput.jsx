import styles from '../styles/components/OptionInput.module.css'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

const SIZES = new Map([
    ['medium', { width: '250px', height: '50px' }]
])

const SYMBOL_SIZES = new Map([
    ['medium', { width: '35px', height: '35px' }]
])

export default function OptionInput(props) {
    const {
        text,
        size = 'medium'
    } = props

    return (
        <button
            className={styles.button}
            style={SIZES.get(size)}
        >
            <div className={styles.symbolContainer}>
                {/* <GroupAddIcon sx={{ color: 'white' }} /> */}
                <div
                    className={styles.symbol}
                    style={SYMBOL_SIZES.get(size)}
                >
                    <h2>A</h2>
                </div>
            </div>
            <div className={styles.text}>
                {text}
            </div>
        </button>
    )
}
