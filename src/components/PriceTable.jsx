import { Box, Button, Container } from "@mui/material";
import styles from '@/styles/components/PriceTable.module.css'

export default function PriceTable(props) {
    const { backgroundColor, outline, price, recurrent, title, onClick } = props

    return (
        <Box className={styles.container} style={{ backgroundColor, outline }}>
            <Box className={styles.top}>
                <img src='/quiz-time-logo.png' className={styles.itemImg} />
                <h2 className={styles.title}>{title}</h2>
            </Box>
            <Box className={styles.bottom}>
                <Box className={styles.priceContainer}>
                    <h1 className={styles.price}>{price}</h1>
                    {recurrent && <h6 className={styles.time}>/{recurrent}</h6>}
                </Box>
                <Button onClick={onClick} variant="contained" className={styles.submitButton} ><p>Assinar</p></Button>
            </Box>
        </Box>
    )
}