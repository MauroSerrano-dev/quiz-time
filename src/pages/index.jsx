import Head from 'next/head';
import styles from '../styles/index.module.css'
import { motion } from "framer-motion"

export default function Index(props) {
  const { session } = props

  return (
    <div>
      <Head>
      </Head>
      <motion.div
        id={styles.sectionsContainer}
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1, ease: [.48, 0, .15, 1.01] }}
      >
        <div>
          <div className={styles.section} id={styles.one}>
            <div id={styles.crowdContainer}>
              <img src='/crowd.jpg' id={styles.crowdImg} />
              <img src='/tela.jpg' id={styles.telaImg} />
            </div>
          </div>
          <div className={styles.section}>
            <div id={styles.halfSection}>
              <h1>Crowd de palestra com um quiz mudando randomicamente o design e perguntas e respostas</h1>
              <p>Transforme suas apresentações mais interativas e divertidas, seja lembrado, seja marcante</p>
            </div>
            <img src='/pc-cel.png' id={styles.pcCelImg} />
          </div>
          <div className={styles.section}>
            <div id={styles.halfSection}>
              <div id={styles.tvContainer}>
                <img src='/crowd.jpg' id={styles.insideTvImg} />
                <img src='/tv-mobile.png' id={styles.tvImg} />
              </div>
            </div>
            <div id={styles.halfSection}>
              <h1>Recolha os dados do seu publico, os resultados, nomes, emails</h1>
            </div>
          </div>
          <div className={styles.section}>
            <div id={styles.halfSection}>
              <h1>Capture emails do seu público 24/7</h1>
            </div>
          </div>
        </div>
      </motion.div>
    </div >
  )
}