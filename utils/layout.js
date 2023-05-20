import styles from '../src/styles/utils/layout.module.css'
import { Box } from '@mui/material';
import ChartPie from '@/components/ChartPie'
import ChartRadar from '@/components/ChartRadar'

function insertLayout(item, results, allResults, radarData) {
    switch (item.name) {
        case 'Image': return {
            name: 'Image',
            value:
                <Box className={styles.layoutItem}>
                    {results.map((result, i) =>
                        <div className={styles.imgTitleContainer} key={`Result: ${i}`}>
                            <div className={styles.resultImgContainer}>
                                <img src={result.img} alt={result.img.split('.')[0]} title={result.img.split('.')[0]} />
                            </div>
                            <h2>{result.name}</h2>
                        </div>
                    )}
                </Box>
        }
        case 'ChartPie': return {
            name: 'ChartPie',
            value:
                <Box className={styles.layoutItem}>
                    <div className={styles.pieContainer}>
                        <ChartPie data={allResults} totalPoints={allResults.reduce((acc, result) => acc + result.points, 0)} />
                    </div>
                </Box>
        }
        case 'ChartRadar': return {
            name: 'ChartRadar',
            value:
                <Box className={styles.layoutItem}>
                    <ChartRadar data={radarData} max={25} />
                </Box>
        }
        case 'Title': return {
            name: 'Title',
            value:
                <Box className={styles.layoutItem}>
                    <h2>{item.title}</h2>
                    {results.map((result, i) =>
                        <p key={i}>{result.texts.filter(text => text.ref === item.title)[0].value}</p>
                    )}
                </Box>
        }
        default: return 'No item with this name.'
    }
}

function getLayout(items, results, allResults, radarData) {
    const teste = [...results, { name: 'Comunicador(a)', texts: [{ ref: 'Preferência Cerebral', value: 'Fazer junto' }], img: 'cat.jpg', color: '#FFD8BE', points: 12 }]
    const layout = []
    for (let i = 0; i < items.length; i++) {
        layout.push(insertLayout(items[i], results, allResults, radarData))
    }
    return layout
}

export {
    getLayout
}