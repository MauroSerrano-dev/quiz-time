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
    id: '123',
    category: '',
    style: {
        question: {
            color: '#fdfdfd',
            variant: 'outlined',
            borderRadius: 10,
        },
        button: {
            color: '#009fda',
            variant: 'contained',
            template: 'colorful',
            symbol: 'polygons',
            symbolColor: '#1c222c',
            textColor: '#1c222c',
            borderRadius: 10,
        },
        background: {
            color: '#1c222c',
            type: 'solid',
            gradientColors: ['#1c222c', '#343f52'],
            gradientPercentages: [0, 100],
            angle: 165,
        },
    },
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
                { content: 'Gerar a ideia global', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
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
                { content: 'Deixar as pessoas confortáveis', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
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
                { content: 'Algo que sempre chega muito cedo', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
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
                { content: 'Mudar de ideia', actions: [{ profile: result3, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult3, points: 1 }] },
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
                { content: 'Ordem e organização', actions: [{ profile: result4, points: 1 }, { profile: subResult1, points: 1 }, { profile: subResult4, points: 1 }] },
                { content: 'Calor humano e animação', actions: [{ profile: result2, points: 1 }, { profile: subResult3, points: 1 }, { profile: subResult2, points: 1 }] },
                { content: 'Coisas claras e simples', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Tempo para mim é...',
            options: [
                { content: 'Algo que detesto desperdiçar', actions: [{ profile: result1, points: 1 }, { profile: subResult4, points: 1 }, { profile: subResult2, points: 1 }] },
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
        {
            name: result1,
            id: 'profile-0',
            lists: [
                {
                    ref: 'Característica Principal',
                    values: ['Fazer rápido']
                },
                {
                    ref: 'Traços Comportamentais',
                    values: ['Senso de urgência', 'Iniciativa', 'Prático', 'Impulsivo', 'Vencer desafios', 'Aqui e agora', 'Auto suficiente', 'Não delegar']
                },
                {
                    ref: 'Pontos Fortes',
                    values: ['Ação', 'Fazer que ocorra', 'Para com a burocracia', 'Motivação']
                },
                {
                    ref: 'Pontos de Melhorias',
                    values: ['Socialmente um desastre', 'Faz da forma mais fácil', 'Relacionamento complicado', 'Precisa melhorar paciência', 'Atenção às pessoas', 'Humildade', 'Consideração', 'Trabalhar coletivamente', 'Ouvir mais']
                },
                {
                    ref: 'Motivações',
                    values: ['Liberdade para agir individualmente', 'Controle das proprias atividades', 'Resolver os problemas do seu jeito', 'Competição', 'Variedade de atividades', 'Não ter que repetir tarefas']
                },
                {
                    ref: 'Valores',
                    values: ['Resultado']
                },
            ],
            img: {
                content: 'leopard.jpg',
                id: 'quiz-123_profile-0',
                name: 'leopard',
                type: 'jpg',
                positionToFit: 'vertical'
            }, color: '#ABDEE6'
        },
        {
            name: result2,
            id: 'profile-1',
            lists: [
                {
                    ref: 'Característica Principal',
                    values: ['Fazer junto']
                },
                {
                    ref: 'Traços Comportamentais',
                    values: ['Sensível', 'Relacionamentos', 'Time', 'Tradicional', 'Contribuição', 'Busca harmonia', 'Delega autoridade']
                },
                {
                    ref: 'Pontos Fortes',
                    values: ['Comunicação', 'Mantém a harmonia', 'Desenvolve e mantém a cultura', 'Comunicação aberta']
                },
                {
                    ref: 'Pontos de Melhorias',
                    values: ['Esconder conflitos', 'Felicidade acima dos resultados', 'Manipulação através de sentimentos', 'Abordagem mais direta', 'Controle de tempo', 'Controle emocional', 'Mais foco', 'Prazos realistas', 'Trabalhar mais a razão']
                },
                {
                    ref: 'Motivações',
                    values: ['Segurança', 'Aceitação social', 'Construir o consenso', 'Reconhecimento da equipa', 'Supervisão compreensiva', 'Ambiente harmonico', 'Trabalho em grupo']
                },
                {
                    ref: 'Valores',
                    values: ['Felicidade e igualdade (pensa nos outros)']
                },
            ],
            img: {
                content: 'dog.jpg',
                id: 'quiz-123_profile-1',
                name: 'dog',
                type: 'jpg',
                positionToFit: 'vertical',
            },
            color: '#FFD8BE'
        },
        {
            name: result3,
            id: 'profile-2',
            lists: [
                {
                    ref: 'Característica Principal',
                    values: ['Fazer diferente']
                },
                {
                    ref: 'Traços Comportamentais',
                    values: ['Criativo', 'Intuitivo', 'Foco no futuro', 'Distraído', 'Curioso', 'Informal e flexível']
                },
                {
                    ref: 'Pontos Fortes',
                    values: ['Idealização', 'Provocar mudanças', 'Antecipar o futuro', 'Criatividade']
                },
                {
                    ref: 'Pontos de Melhorias',
                    values: ['Falta de atenção no presente', 'Impaciência e rebeldia', 'Defender o novo pelo novo', 'Trabalho em equipa', 'Verbalização']
                },
                {
                    ref: 'Motivações',
                    values: ['Liberdade de expressão', 'Ausência de controle rígido', 'Oportunidade para delegar']
                },
                {
                    ref: 'Valores',
                    values: ['Criatividade e liberdade (inspirar ideias)']
                },
            ],
            img: {
                content: 'eagle.jpg',
                id: 'quiz-123_profile-2',
                name: 'eagle',
                type: 'jpg',
                positionToFit: 'horizontal',
            },
            color: '#FFF7D2'
        },
        {
            name: result4,
            id: 'profile-3',
            lists: [
                {
                    ref: 'Característica Principal',
                    values: ['Fazer certo']
                },
                {
                    ref: 'Traços Comportamentais',
                    values: ['Detalhista', 'Organizado', 'Estrategista', 'Busca do conhecimento', 'Pontual', 'Conservador', 'Previsivel']
                },
                {
                    ref: 'Pontos Fortes',
                    values: ['Organização', 'Passado presente e futuro', 'Consistência', 'Conformidade e qualidade', 'Lealdade e segurança', 'Regras e responsabilidades']
                },
                {
                    ref: 'Pontos de Melhorias',
                    values: ['Dificuldade de se adaptar a mudanças', 'Pode impedir o progresso', 'Detalhista', 'Estruturado e demasiadamente sistematizado', 'Melhorar o entusiasmo', 'Flexibilidade', 'Aceitação de outros estilos comportamentais', 'Método de atalho']
                },
                {
                    ref: 'Motivações',
                    values: ['Certeza', 'Compreensão exata das regras', 'Conhecimento específico', 'Ausência de riscos e erros', 'Vero produto acabado (começo, meio e fim)']
                },
                {
                    ref: 'Valores',
                    values: ['Ordem e controle']
                },
            ],
            img: {
                content: 'wolf.jpg',
                id: 'quiz-123_profile-3',
                name: 'wolf',
                type: 'jpg',
                positionToFit: 'vertical',
            },
            color: '#CBAACB'
        },
    ],
    resultLayout: [],
    subResults: [
        { name: subResult1, texts: [], img: { content: '', name: '', type: '' }, color: '' },
        { name: subResult3, texts: [], img: { content: '', name: '', type: '' }, color: '' },
        { name: subResult2, texts: [], img: { content: '', name: '', type: '' }, color: '' },
        { name: subResult4, texts: [], img: { content: '', name: '', type: '' }, color: '' },
    ],
    layout: [
        { name: 'Image' },
        { name: 'ChartPie', legend: true },
        { name: 'ChartRadar', radarOrder: radarOrder },
        { name: 'List', title: 'Característica Principal', ordered: false },
        { name: 'List', title: 'Traços Comportamentais', ordered: false },
        { name: 'List', title: 'Pontos Fortes', ordered: false },
        { name: 'List', title: 'Pontos de Melhorias', ordered: false },
        { name: 'List', title: 'Motivações', ordered: false },
        { name: 'List', title: 'Valores', ordered: false },
    ]
}

const newRoom = {
    "name": "test",
    "code": "test",
    "private": false,
    "control": false,
    "password": "",
    "state": "active",
    "quizInfo": { "name": "Perfil Comportamental", "purchaseDate": "", "type": "standard" },
    "currentQuestion": 0,
    "players": [
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Mauro Serrano Dev",
                "email": "mauro.serrano.dev@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [],
            "currentQuestion": 0,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 1",
                "email": "test1@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [
                {
                    "content": "Idealista, criativo e visionário",
                    "actions": [{ "profile": "Idealizador(a)", "points": 1 },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 0,
                    "optionIndex": 0
                },
            ],
            "currentQuestion": 1,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 2",
                "email": "test2@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [
                {
                    "content": "Idealista, criativo e visionário",
                    "actions": [{ "profile": "Idealizador(a)", "points": 1 },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 0,
                    "optionIndex": 0
                },
                {
                    "content": "Conversar com os passageiros",
                    "actions": [{ "profile": "Comunicador(a)", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 1,
                    "optionIndex": 1
                },
            ],
            "currentQuestion": 2,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 3",
                "email": "test3@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [
                {
                    "content": "Idealista, criativo e visionário",
                    "actions": [{ "profile": "Idealizador(a)", "points": 1 },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 0,
                    "optionIndex": 0
                },
                {
                    "content": "Conversar com os passageiros",
                    "actions": [{ "profile": "Comunicador(a)", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 1,
                    "optionIndex": 1
                },
                {
                    "content": "Seja amigável, carinhoso e compreensivo",
                    "actions": [{
                        "profile": "Comunicador(a)",
                        "points": 1
                    },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 2,
                    "optionIndex": 3
                },
            ],
            "currentQuestion": 3,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 4",
                "email": "test4@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [
                {
                    "content": "Idealista, criativo e visionário",
                    "actions": [{ "profile": "Idealizador(a)", "points": 1 },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 0,
                    "optionIndex": 0
                },
                {
                    "content": "Conversar com os passageiros",
                    "actions": [{ "profile": "Comunicador(a)", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 1,
                    "optionIndex": 1
                }, {
                    "content": "Seja amigável, carinhoso e compreensivo",
                    "actions": [{
                        "profile": "Comunicador(a)",
                        "points": 1
                    },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 2,
                    "optionIndex": 3
                },
                {
                    "content": "Ter incertezas",
                    "actions": [{
                        "profile": "Idealizador(a)",
                        "points": 1
                    },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 3,
                    "optionIndex": 0
                },
                {
                    "content": "Tenho novidades",
                    "actions": [{
                        "profile": "Idealizador(a)",
                        "points": 1
                    },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 4,
                    "optionIndex": 1
                },
            ],
            "currentQuestion": 5,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 5",
                "email": "test5@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [
                {
                    "content": "Idealista, criativo e visionário",
                    "actions": [{ "profile": "Idealizador(a)", "points": 1 },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 0,
                    "optionIndex": 0
                },
                {
                    "content": "Conversar com os passageiros",
                    "actions": [{ "profile": "Comunicador(a)", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 1,
                    "optionIndex": 1
                }, {
                    "content": "Seja amigável, carinhoso e compreensivo",
                    "actions": [{
                        "profile": "Comunicador(a)",
                        "points": 1
                    },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 2,
                    "optionIndex": 3
                },
                {
                    "content": "Ter incertezas",
                    "actions": [{
                        "profile": "Idealizador(a)",
                        "points": 1
                    },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 3,
                    "optionIndex": 0
                },
                {
                    "content": "Tenho novidades",
                    "actions": [{
                        "profile": "Idealizador(a)",
                        "points": 1
                    },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 4,
                    "optionIndex": 1
                },
                {
                    "content": "Um homem prevenido vale por dois",
                    "actions": [{
                        "profile": "Organizador(a)",
                        "points": 1
                    },
                    {
                        "profile": "Pensante",
                        "points": 1
                    },
                    {
                        "profile": "Lógico(a)",
                        "points": 1
                    }],
                    "questionIndex": 5,
                    "optionIndex": 3
                },
            ],
            "currentQuestion": 6,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 6",
                "email": "test6@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [],
            "currentQuestion": 0,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 7",
                "email": "test7@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [
                {
                    "content": "Idealista, criativo e visionário",
                    "actions": [{ "profile": "Idealizador(a)", "points": 1 },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 0,
                    "optionIndex": 0
                },
                {
                    "content": "Conversar com os passageiros",
                    "actions": [{ "profile": "Comunicador(a)", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 1,
                    "optionIndex": 1
                }, {
                    "content": "Seja amigável, carinhoso e compreensivo",
                    "actions": [{
                        "profile": "Comunicador(a)",
                        "points": 1
                    },
                    { "profile": "Criativo(a)", "points": 1 },
                    { "profile": "Atuante", "points": 1 }],
                    "questionIndex": 2,
                    "optionIndex": 3
                },
                {
                    "content": "Ter incertezas",
                    "actions": [{
                        "profile": "Idealizador(a)",
                        "points": 1
                    },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 3,
                    "optionIndex": 0
                },
                {
                    "content": "Tenho novidades",
                    "actions": [{
                        "profile": "Idealizador(a)",
                        "points": 1
                    },
                    { "profile": "Pensante", "points": 1 },
                    { "profile": "Criativo(a)", "points": 1 }],
                    "questionIndex": 4,
                    "optionIndex": 1
                },
                {
                    "content": "Um homem prevenido vale por dois",
                    "actions": [{
                        "profile": "Organizador(a)",
                        "points": 1
                    },
                    {
                        "profile": "Pensante",
                        "points": 1
                    },
                    {
                        "profile": "Lógico(a)",
                        "points": 1
                    }],
                    "questionIndex": 5,
                    "optionIndex": 3
                },
            ],
            "currentQuestion": 6,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 8",
                "email": "test8@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [],
            "currentQuestion": 0,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 9",
                "email": "test9@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [],
            "currentQuestion": 0,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        },
        {
            "user": {
                "id": "64730ab674fb9de3f50709bb",
                "name": "Test 10",
                "email": "test10@gmail.com",
                "image": "https://lh3.googleusercontent.com/a/AAcHTtcggnb2BK_MtbyXGi1t99d7Wgs4jevmZgNX5DiT=s96-c",
                "createAt": "2023-05-28T08:03:02.233Z",
                "quizzesInfos": [
                    {
                        "name": "Perfil Comportamental",
                        "purchaseDate": "",
                        "type": "standard"
                    }
                ],
                "quizzes": [],
                "purchases": [],
                "plan": { "name": "Free" },
                "emailVerified": null
            },
            "answers": [],
            "currentQuestion": 0,
            "state": "answering",
            "lastAnswerDate": "2023-05-30T01:45:20.586Z"
        }
    ],
    "owner": "Quiz Time"
}

export default function Settings(props) {
    const { session, signIn } = props

    async function handlePopulateQuiz() {
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quiz: quiz }),
        };

        const response = await fetch('/api/quizzesStandard', options);
        const json = await response.json();
    }

    async function handlePopulateRoom() {
        const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room: newRoom }),
        }

        await fetch('/api/rooms', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
    }

    return (
        <div>
            {session === null
                ? <NoSessionPage signIn={signIn} />
                : <div>
                    <main>
                        {process.env.NODE_ENV === 'development' &&
                            <div>
                                <Button variant="outlined" onClick={handlePopulateQuiz}>Populate Quiz</Button>
                                <Button variant="outlined" onClick={handlePopulateRoom}>Populate Room</Button>
                            </div>
                        }
                        <a href='https://billing.stripe.com/p/login/test_dR68y53sd60y5gI144' target='_blank'>
                            <Button variant="outlined" >Gerenciar Assinatura</Button>
                        </a>
                    </main>
                </div>
            }
        </div>
    )
}