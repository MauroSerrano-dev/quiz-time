import styles from '../src/styles/utils/layout.module.css'
import { Box } from '@mui/material';
import ChartPie from '@/components/ChartPie'
import ChartRadar from '@/components/ChartRadar'

const IMG_SIZES = new Map([
    [1, 100],
    [2, 50],
    [3, 50],
    [4, 50],
    [5, 33],
    [6, 33],
    [7, 33],
    [8, 33],
    [9, 33],
    [10, 25],
    [11, 25],
    [12, 25],
    [13, 25],
    [14, 25],
    [15, 25],
    [16, 25],
])

function insertLayout(item, results, allResults, radarData, quizResults) {
    switch (item.name) {
        case 'Image': return {
            name: 'Image',
            value:
                <Box className={`${styles.itemImg} ${styles.layoutItem}`}>
                    <div className={styles.allImgs}>
                        {results.map((result, i) =>
                            <div
                                className={styles.imgTitleContainer}
                                style={{
                                    width: `${IMG_SIZES.get(results.length)}%`,
                                    height: `${IMG_SIZES.get(results.length)}%`,
                                    fontSize: `${IMG_SIZES.get(results.length) / 6}px`,
                                }}
                                key={`Result: ${i}`}
                            >
                                <div className={styles.resultImgContainer}>
                                    <img
                                        style={quizResults.filter(quizResult => quizResult.id === result.id)[0].img.positionToFit === 'vertical'
                                            ? { height: 'auto', width: '100%' }
                                            : { height: '100%', width: 'auto' }}
                                        src={quizResults.filter(quizResult => quizResult.id === result.id)[0].img.content}
                                        alt={result.img.name} title={result.img.name}
                                    />
                                </div>
                                <h2>{result.name}</h2>
                            </div>
                        )}
                    </div>
                </Box>
        }
        case 'ChartPie': return {
            name: 'ChartPie',
            value:
                <Box className={`${styles.itemPie} ${styles.layoutItem}`}>
                    <div className='flex center fillWidth'>
                        <ChartPie
                            data={allResults}
                            totalPoints={allResults.reduce((acc, result) => acc + result.points, 0)}
                        />
                    </div>
                </Box>
        }
        case 'ChartRadar': return {
            name: 'ChartRadar',
            value:
                <Box className={`${styles.itemRadar} ${styles.layoutItem} flex center`}>
                    <ChartRadar data={radarData} max={25} />
                </Box>
        }
        case 'Title': return {
            name: 'Title',
            value:
                <Box className={`${styles.layoutItem} flex start`}>
                    <h2>{item.title}</h2>
                    {results.map((result, i) =>
                        <p key={i}>
                            {result.texts.filter(text => text.ref === item.title)[0].value}
                        </p>
                    )}
                </Box>
        }
        case 'List': return {
            name: 'List',
            value:
                <Box className={`${styles.layoutItem} flex start`}>
                    <h2 className={styles.listTitle} >{item.title}</h2>
                    {results.map((result, i) =>
                        item.ordered
                            ? <ol className={styles.list} key={i}>
                                {result.lists.filter(text => text.ref === item.title)[0].values.map((li, j) =>
                                    <li className={styles.listItem} key={j}>{li}</li>)}
                            </ol>
                            : <ul className={styles.list} key={i}>
                                {result.lists.filter(text => text.ref === item.title)[0].values.map((li, j) =>
                                    <li className={styles.listItem} key={j}>{li}</li>)}
                            </ul>
                    )}
                </Box>
        }
        default: return 'No item with this name.'
    }
}

function getLayout(items, results, allResults, radarData, quizResults) {
    const layout = []
    for (let i = 0; i < items.length; i++) {
        layout.push(insertLayout(items[i], results, allResults, radarData, quizResults))
    }
    return layout
}

export {
    getLayout
}