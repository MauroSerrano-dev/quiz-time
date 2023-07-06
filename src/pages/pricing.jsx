import Head from 'next/head';
import styles from '../styles/pricing.module.css'
import { checkout } from './api/checkout';
import PriceTable from '@/components/PriceTable';
import { motion } from "framer-motion"

export default function Pricing(props) {
    const { session } = props

    function callCheckout(price, planName) {
        checkout({
            lineItems: [
                {
                    price: price,
                    quantity: 1,
                }
            ],
            mode: 'subscription',
            email: session.user.email,
            planName: planName
        })
    }

    const container = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: 0.7,
                delayChildren: 1,
                staggerChildren: 0.2,
                duration: 0.2,
            }
        }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div>
            <Head>
            </Head>
            {process.env.NODE_ENV === 'development' &&
                <main>
                    <motion.div
                        id={styles.pricesContainer}
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={item}>
                            <PriceTable
                                title={'Quiz Time Silver'}
                                price={'€ 5,90'}
                                onClick={() => callCheckout('price_1NA6YMG4uTYyyhYycTjRNYk7', 'Silver')}
                                recurrent={'mês'}
                                backgroundColor={'transparent'}
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <PriceTable
                                title={'Quiz Time Gold'}
                                price={'€ 14,90'}
                                onClick={() => callCheckout('price_1NANnGG4uTYyyhYyRIGefjQr', 'Gold')}
                                recurrent={'mês'}
                                backgroundColor={'#e6e6e6'}
                                outline={'solid 1px #dadada'}
                                tag={'Mais Popular'}
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <PriceTable
                                title={'Quiz Time Premium'}
                                price={'€ 39,90'}
                                onClick={() => callCheckout('price_1NANwwG4uTYyyhYysapo5kKv', 'Premium')}
                                recurrent={'mês'}
                                backgroundColor={'transparent'}
                            />
                        </motion.div>
                    </motion.div>
                </main>
            }
        </div>
    );
}