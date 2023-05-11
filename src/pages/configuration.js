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
                { content: 'Idealista, criativo e visionário', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Divertido, espiritual e benéfico', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Confiável, meticuloso e previsível', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Focado, determinado e persistente', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Ser piloto', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Conversar com os passageiros', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Planejar a viagem', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Explorar novas rotas', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Se você quiser se dar bem comigo...',
            options: [
                { content: 'Me dê liberdade', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Me deixe saber sua expectativa', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Lidere, siga ou saia do caminho', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Seja amigável, carinhoso e compreensivo', actions: [{ profile: 'Comunicador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Para conseguir obter bons resultados é preciso...',
            options: [
                { content: 'Ter incertezas', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Controlar o essencial', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Diversão e cerebração', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Planejar e obter recursos', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu me divirto quando...',
            options: [
                { content: 'Estou me exercitando', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Tenho novidades', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Estou com outros', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Determino as regras', actions: [{ profile: 'Organizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu penso que...',
            options: [
                { content: 'Unidos venceremos, dividos perderemos', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'O ataque é melhor que a defesa', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'É bom ser manso, mas andar com um porrete', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Um homem prevenido vale por dois', actions: [{ profile: 'Organizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Minha preocupação é...',
            options: [
                { content: 'Gerar a idéia global', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Fazer com quem as pessoas gostem', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Fazer com que funcione', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Fazer com que aconteça', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu prefiro...',
            options: [
                { content: 'Perguntas a respostas', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Ter todos os detalhes', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Vantagens a meu favor', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Que todos tenham a chance de ser ouvido', actions: [{ profile: 'Comunicador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Fazer progresso', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Construir memórias', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Fazer sentido', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Tornar as pessoas confortáveis', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de chegar...',
            options: [
                { content: 'Na frente', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Junto', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Na hora', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Em outro lugar', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Um ótimo dia para mim é quando...',
            options: [
                { content: 'Consigo fazer muitas coisas', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Me divirto com meus amigos', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Tudo segue conforme planejado', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Desfruto de coisas novas e estimulantes', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu vejo a morte como...',
            options: [
                { content: 'Uma grande aventura misteriosa', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Oportunidade para rever os falecidos', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Um modo de receber recompensas', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Algo que sempe chega muito cedo', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Minha filosofia de vida é...',
            options: [
                { content: 'Há ganhadores e perdedores, e eu acredito ser um ganhador', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Para eu ganhar, niguém precisa perder', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Para ganhar é preciso seguir as regras', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Para ganhar, é necessário inventar novas regras', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu sempre gostei de...',
            options: [
                { content: 'Explorar', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Evitar surpresas', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Focalizar a meta', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Realizar uma abordagem natural', actions: [{ profile: 'Comunicador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de mudanças se...',
            options: [
                { content: 'Me der uma vantagem competitiva', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'For divertido e puder ser compartilhado', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Me der mais liberdade e variedade', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Melhorar ou me der mais controle', actions: [{ profile: 'Organizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Não existe nada de errado em...',
            options: [
                { content: 'Se colocar na frente', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Colocar os outros na frente', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Mudar de idéia', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Ser consistente', actions: [{ profile: 'Organizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de buscar conselhos de...',
            options: [
                { content: 'Pessoas bem sucedidas', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Anciões e conselheiros', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Autoridades no assunto', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Lugares, os mais estranhos', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Meu lema é...',
            options: [
                { content: 'Fazer o que precisa ser feito', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Fazer bem feito', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Fazer junto com o grupo', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Simplesmente fazer', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Complexidade, mesmo se confuso', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Ordem e sistematização', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Calor humano e animação', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Coisas claras e simples', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Tempo para mim é...',
            options: [
                { content: 'Algo que detesto disperdiçar', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'Um grande ciclo', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Uma flecha que leva ao inevitável', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Irrelevante', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Se eu fosse bilionário...',
            options: [
                { content: 'Faria doações para muitas entidades', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Criaria uma poupança avantajada', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Faria o que desse na cabeça', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Exibiria bastante com algumas pessoas', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu acredito que...',
            options: [
                { content: 'O destino é mais importante que a jornada', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'A jornada é mais importante que o destino', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Um centavo economizado é um centavo ganho', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Bastam um navio e uma estrela para navegar', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu acredito também que...',
            options: [
                { content: 'Aquele que hesita está perdido', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'De grão em grão a galinha enche o papo', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'O que vai, volta', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Um sorriso ou uma careta é o mesmo para quem e cego', actions: [{ profile: 'Idealizador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu acredito ainda que...',
            options: [
                { content: 'É melhor prudência do que arrependimento', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'A autoridade deve ser desafiada', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'Ganhar é fundamental', actions: [{ profile: 'Ativador', points: 1 }] },
                { content: 'O coletivo é mais importante do que o individual', actions: [{ profile: 'Comunicador', points: 1 }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu penso que...',
            options: [
                { content: 'Não é fácil ficar encurralado', actions: [{ profile: 'Idealizador', points: 1 }] },
                { content: 'É preferível olhar, antes de pular', actions: [{ profile: 'Organizador', points: 1 }] },
                { content: 'Duas cabeças pensam melhor do que uma', actions: [{ profile: 'Comunicador', points: 1 }] },
                { content: 'Se você não tem condições de competir, não compita', actions: [{ profile: 'Ativador', points: 1 }] },
            ],
            optionsRandom: false
        },
    ],
    results: [
        { name: 'Ativador', description: '', img: 'shark.jpg' },
        { name: 'Comunicador', description: '', img: 'cat.jpg' },
        { name: 'Idealizador', description: '', img: 'eagle.jpg' },
        { name: 'Organizador', description: '', img: 'wolf.jpg' },
    ],
    resultLayout: [],
    subResults: []
}

export default function Configuration() {

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
                {process.env.NODE_ENV === 'development' && <button onClick={handlePopulate}>Populate</button>}
            </main>
        </div>
    );
}
