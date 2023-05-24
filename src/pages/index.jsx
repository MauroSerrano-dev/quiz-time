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
        className={styles.sectionsContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, easings: ["easeInOut"] }}
      >
        <section className={`${styles.section} ${styles.one}`}>
          <div className={styles.crowdContainer}>
            <img src='/crowd.jpg' className={styles.crowdImg} />
            <img src='/tela.jpg' className={styles.telaImg} />
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.demoTitle}>
            <h1>Crowd de palestra com um quiz mudando randomicamente o design e perguntas e respostas</h1>
            <p>Transforme suas apresentações mais interativas e divertidas, seja lembrado, seja marcante</p>
          </div>
          <img src='/pc-cel.png' className={styles.pcCelImg} />
        </section>
        <section className={styles.section}>
          <div className={styles.demoTitle}>
            <h1>Recolha os dados do seu publico, os resultados, nomes, emails</h1>
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.demoTitle}>
            <h1>Capture emails do seu público 24/7</h1>
          </div>
        </section>
      </motion.div>
    </div >
  );
}