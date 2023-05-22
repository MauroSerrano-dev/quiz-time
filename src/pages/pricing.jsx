import Head from 'next/head';
import styles from '../styles/pricing.module.css'
import { checkout } from './api/checkout';
import PriceTable from '@/components/PriceTable';

export default function Pricing(props) {
    const { session } = props

    function callCheckout(price, plan) {
        checkout({
            lineItems: [
                {
                    price: price,
                    quantity: 1,
                }
            ],
            mode: 'subscription',
            email: session.user.email,
            plan: plan
        })
    }

    return (
        <div>
            <Head>
            </Head>
            <main>
                <div className={styles.pricesContainer}>
                    <PriceTable
                        title={'Quiz Time Silver'}
                        price={'€ 5,90'}
                        onClick={() => callCheckout('price_1NA6YMG4uTYyyhYycTjRNYk7', 'Silver')}
                        recurrent={'mês'}
                        backgroundColor={'transparent'} />
                    <PriceTable
                        title={'Quiz Time Gold'}
                        price={'€ 14,90'}
                        onClick={() => callCheckout('price_1NANnGG4uTYyyhYyRIGefjQr', 'Gold')}
                        recurrent={'mês'}
                        backgroundColor={'#e6e6e6'}
                        outline={'solid 1px #dadada'}
                        tag={'Mais Popular'} />
                    <PriceTable
                        title={'Quiz Time Premium'}
                        price={'€ 39,90'}
                        onClick={() => callCheckout('price_1NANwwG4uTYyyhYysapo5kKv', 'Premium')}
                        recurrent={'mês'}
                        backgroundColor={'transparent'} />
                </div>
            </main>
        </div>
    );
}