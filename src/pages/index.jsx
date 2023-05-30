import Head from 'next/head';
import styles from '../styles/index.module.css'
import { motion } from "framer-motion"
import { useEffect, useState } from 'react';

export default function Index(props) {
  const { session } = props
  const [progress, setProgress] = useState(0.5)

  useEffect(() => {
    const sections = document.getElementById(styles.scrollDiv)
    const handleScroll = () => {
      if (!sections) return
      /* setProgress(sections.scrollHeight / sections.clientHeight) */
      setProgress(sections.scrollTop / sections.clientHeight)
      console.log("Scrolling...", sections.scrollTop)
    }

    if (sections) {
      const middleScrollPosition = sections.scrollHeight / 2 - sections.clientHeight / 2;
      sections.scrollTo(0, middleScrollPosition);
      sections.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (sections) {
        sections.removeEventListener("scroll", handleScroll);
      }
    }
  }, []);



  return (
    <div>
      <Head>
      </Head>
      <motion.div
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1, easings: ["easeInOut"] }}
      >
        <motion.div
          id={styles.sectionsContainer}
          animate={
            progress <= 0.05
              ? { scale: Math.max(1.1, 2.2 - (progress * 3)), bottom: "-160px", left: "-70px" }
              : progress <= 0.5
                ? { scale: Math.max(1.1, 2.2 - (progress * 3)), bottom: "0px", left: "0px" }
                : progress <= 0.75
                  ? { scale: Math.max(1.1, 2.2 - (progress * 3)), bottom: "0px", left: "0px" }
                  : { scale: Math.max(1.1, 2.2 - (progress * 3)), bottom: "0px", left: "0px" }
          }
          transition={{ duration: 0.2, easings: ["easeInOut"] }}
        >
          <div>
            {/* <div className={styles.section} id={styles.zero}>
          </div> */}
            <div className={styles.section} id={styles.one}>
              <div id={styles.crowdContainer}>
                <img src='/crowd.jpg' id={styles.crowdImg} />
                <img src='/tela.jpg' id={styles.telaImg} />
              </div>
            </div>
            <div className={styles.section}>
              <div id={styles.demoTitle}>
                <h1>Crowd de palestra com um quiz mudando randomicamente o design e perguntas e respostas</h1>
                <p>Transforme suas apresentações mais interativas e divertidas, seja lembrado, seja marcante</p>
              </div>
              <img src='/pc-cel.png' id={styles.pcCelImg} />
            </div>
            <div className={styles.section}>
              <div id={styles.demoTitle}>
                <h1>Recolha os dados do seu publico, os resultados, nomes, emails</h1>
              </div>
            </div>
            <div className={styles.section}>
              <div id={styles.demoTitle}>
                <h1>Capture emails do seu público 24/7</h1>
              </div>
            </div>
          </div>
          <div id={styles.scrollDiv}>
            <div id={styles.insideScrollDiv}></div>
          </div>
        </motion.div>
      </motion.div>
    </div >
  );
}