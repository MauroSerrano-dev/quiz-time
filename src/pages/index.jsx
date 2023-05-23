import Head from 'next/head';
import styles from '../styles/index.module.css'

export default function Index(props) {
  const { session } = props

  return (
    <div>
      <Head>
      </Head>
      <main>
        <section className={styles.demo}>
          <div className={styles.demoTitle}>
            <h1>Crowd de palestra com um quiz mudando randomicamente o design e perguntas e respostas</h1>
            <p>Transforme suas apresentações mais interativas e divertidas, seja lembrado, seja marcante</p>
          </div>
          <img src='/pc-cel.png' className={styles.pcImg} />
        </section>
        <section className={styles.demo}>
          <div className={styles.demoTitle}>
            <h1>Recolha os dados do seu publico, os resultados, nomes, emails</h1>
          </div>
        </section>
        <section className={styles.demo}>
          <div className={styles.demoTitle}>
            <h1>Capture emails do seu público 24/7</h1>
          </div>
        </section>
      </main>
    </div>
  );
}