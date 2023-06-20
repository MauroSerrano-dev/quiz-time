import { Box, Button, Container } from "@mui/material";
import styles from '@/styles/components/PriceTable.module.css'
import Logo from "./Logo";

export default function PriceTable(props) {
    const { backgroundColor, outline, price, recurrent, title, onClick, tag } = props

    return (
        <Box id={styles.container} style={{ backgroundColor, outline }}>
            <div id={styles.tagContainer}>
                {tag &&
                    <div id={styles.tag}>
                        <div id={styles.glow}></div>
                        <h6>{tag}</h6>
                    </div>}
            </div>
            <Box id={styles.top}>
                <Logo width='73%' fill='#000000'/>
                <h2 id={styles.title}>{title}</h2>
            </Box>
            <Box id={styles.bottom}>
                <Box id={styles.priceContainer}>
                    <h1 id={styles.price}>{price}</h1>
                    {recurrent && <h6 id={styles.time}>/{recurrent}</h6>}
                </Box>
                <Button onClick={onClick} variant="contained" id={styles.submitButton} ><p>Assinar</p></Button>
            </Box>
        </Box>
    )
}