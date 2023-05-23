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
            <h1>Exemplo de title</h1>
            <p>Exemplo de paragrafo</p>
          </div>
          <img src='/pc-cel.png' className={styles.pcImg} />
        </section>
      </main>
    </div>
  );
}