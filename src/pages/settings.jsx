import { Button } from "@mui/material"

const result1 = 'Ativador(a)'
const result2 = 'Comunicador(a)'
const result3 = 'Idealizador(a)'
const result4 = 'Organizador(a)'

const subResult1 = 'Pensante'
const subResult2 = 'Atuante'
const subResult3 = 'Criativo(a)'
const subResult4 = 'Lógico(a)'

const radarOrder2 = [subResult1, subResult3, subResult2, subResult4]
const radarOrder = [subResult1, result3, subResult3, result2, subResult2, result1, subResult4, result4]

const quiz = {
    _id: '123',
    name: 'Perfil Comportamental',
    mode: 'profile',
    questionsRandom: false,
    enumeration: false,
    questions: [
        {
            content: 'Eu sou...',
            options: [
                { content: 'Idealista, criativo e visionário', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Divertido, espiritual e benéfico', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Confiável, meticuloso e previsível', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Focado, determinado e persistente', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Ser piloto', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Conversar com os passageiros', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Planejar a viagem', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Explorar novas rotas', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Se você quiser se dar bem comigo...',
            options: [
                { content: 'Me dê liberdade', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Me deixe saber sua expectativa', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Lidere, siga ou saia do caminho', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Seja amigável, carinhoso e compreensivo', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Para conseguir obter bons resultados é preciso...',
            options: [
                { content: 'Ter incertezas', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Controlar o essencial', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Diversão e cerebração', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Planejar e obter recursos', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu me divirto quando...',
            options: [
                { content: 'Estou me exercitando', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Tenho novidades', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Estou com outros', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Determino as regras', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu penso que...',
            options: [
                { content: 'Unidos venceremos, dividos perderemos', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'O ataque é melhor que a defesa', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'É bom ser manso, mas andar com um porrete', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Um homem prevenido vale por dois', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Minha preocupação é...',
            options: [
                { content: 'Gerar a idéia global', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Fazer com quem as pessoas gostem', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Fazer com que funcione', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Fazer com que aconteça', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu prefiro...',
            options: [
                { content: 'Perguntas a respostas', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Ter todos os detalhes', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Vantagens a meu favor', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Que todos tenham a chance de ser ouvido', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Fazer progresso', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Construir memórias', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Fazer sentido', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Tornar as pessoas confortáveis', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de chegar...',
            options: [
                { content: 'Na frente', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Junto', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Na hora', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Em outro lugar', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Um ótimo dia para mim é quando...',
            options: [
                { content: 'Consigo fazer muitas coisas', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Me divirto com meus amigos', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Tudo segue conforme planejado', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Desfruto de coisas novas e estimulantes', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu vejo a morte como...',
            options: [
                { content: 'Uma grande aventura misteriosa', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Oportunidade para rever os falecidos', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Um modo de receber recompensas', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Algo que sempe chega muito cedo', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Minha filosofia de vida é...',
            options: [
                { content: 'Há ganhadores e perdedores, e eu acredito ser um ganhador', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Para eu ganhar, niguém precisa perder', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Para ganhar é preciso seguir as regras', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Para ganhar, é necessário inventar novas regras', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu sempre gostei de...',
            options: [
                { content: 'Explorar', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Evitar surpresas', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Focalizar a meta', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Realizar uma abordagem natural', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de mudanças se...',
            options: [
                { content: 'Me der uma vantagem competitiva', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'For divertido e puder ser compartilhado', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Me der mais liberdade e variedade', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Melhorar ou me der mais controle', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Não existe nada de errado em...',
            options: [
                { content: 'Se colocar na frente', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Colocar os outros na frente', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Mudar de idéia', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Ser consistente', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de buscar conselhos de...',
            options: [
                { content: 'Pessoas bem sucedidas', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Anciões e conselheiros', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Autoridades no assunto', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Lugares, os mais estranhos', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Meu lema é...',
            options: [
                { content: 'Fazer o que precisa ser feito', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Fazer bem feito', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Fazer junto com o grupo', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Simplesmente fazer', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Complexidade, mesmo se confuso', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Ordem e sistematização', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Calor humano e animação', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Coisas claras e simples', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Tempo para mim é...',
            options: [
                { content: 'Algo que detesto disperdiçar', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Um grande ciclo', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Uma flecha que leva ao inevitável', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Irrelevante', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Se eu fosse bilionário...',
            options: [
                { content: 'Faria doações para muitas entidades', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Criaria uma poupança avantajada', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Faria o que desse na cabeça', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Exibiria bastante com algumas pessoas', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu acredito que...',
            options: [
                { content: 'O destino é mais importante que a jornada', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'A jornada é mais importante que o destino', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Um centavo economizado é um centavo ganho', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Bastam um navio e uma estrela para navegar', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu acredito também que...',
            options: [
                { content: 'Aquele que hesita está perdido', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'De grão em grão a galinha enche o papo', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'O que vai, volta', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Um sorriso ou uma careta é o mesmo para quem e cego', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu acredito ainda que...',
            options: [
                { content: 'É melhor prudência do que arrependimento', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'A autoridade deve ser desafiada', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'Ganhar é fundamental', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'O coletivo é mais importante do que o individual', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu penso que...',
            options: [
                { content: 'Não é fácil ficar encurralado', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
                { content: 'É preferível olhar, antes de pular', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Duas cabeças pensam melhor do que uma', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Se você não tem condições de competir, não compita', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
    ],
    results: [
        { name: result1, texts: [{ ref: 'Preferência Cerebral', value: 'Fazer rápido' }, { ref: 'Preferências Cerebral', value: 'Fazersadsa rápido' }], img: 'shark.jpg', color: '#ABDEE6' },
        { name: result2, texts: [{ ref: 'Preferência Cerebral', value: 'Fazer junto' }], img: 'cat.jpg', color: '#FFD8BE' },
        { name: result3, texts: [{ ref: 'Preferência Cerebral', value: 'Fazer diferente' }], img: 'eagle.jpg', color: '#FFF7D2' },
        { name: result4, texts: [{ ref: 'Preferência Cerebral', value: 'Fazer certo' }], img: 'wolf.jpg', color: '#CBAACB' },
    ],
    resultLayout: [],
    subResults: [
        { name: subResult1, texts: [], img: '', color: '' },
        { name: subResult3, texts: [], img: '', color: '' },
        { name: subResult2, texts: [], img: '', color: '' },
        { name: subResult4, texts: [], img: '', color: '' },
    ],
    layout: [
        { name: 'Image' },
        { name: 'ChartPie', legend: true },
        { name: 'ChartRadar', radarOrder: radarOrder },
        { name: 'Title', title: 'Preferência Cerebral' }
    ]
}

export default function Settings(props) {
    const { session } = props

    async function handlePopulate() {

        const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quiz: quiz }),
        };

        const response = await fetch('/api/quizzesStandard', options);
        const json = await response.json();
        console.log(json)
    }

    return (
        <div>
            <main>
                {process.env.NODE_ENV === 'development' &&
                    <div>
                        <Button variant="outlined" onClick={handlePopulate}>Populate</Button>
                    </div>
                }
                <a href='https://billing.stripe.com/p/login/test_dR68y53sd60y5gI144' target='_blank'>
                    <Button variant="outlined" >Gerenciar Assinatura</Button>
                </a>
            </main>
        </div>
    );
}
