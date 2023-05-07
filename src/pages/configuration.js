const quiz = {
    _id: '123',
    name: 'Perfil Comportamental',
    mode: 'profile',
    questionsRandom: false,
    questions: [
        {
            content: 'Eu sou...',
            options: [
                { content: 'Idealista, criativo e visionário', actions: [{ profile: 'Idealizador', points: '1' }] },
                { content: 'Divertido, espiritual e benéfico', actions: [{ profile: 'Comunicador', points: '1' }] },
                { content: 'Confiável, meticuloso e previsível', actions: [{ profile: 'Organizador', points: '1' }] },
                { content: 'Focado, determinado e persistente', actions: [{ profile: 'Ativador', points: '1' }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu gosto de...',
            options: [
                { content: 'Ser piloto', actions: [{ profile: 'Ativador', points: '1' }] },
                { content: 'Conversar com os passageiros', actions: [{ profile: 'Comunicador', points: '1' }] },
                { content: 'Planejar a viagem', actions: [{ profile: 'Organizador', points: '1' }] },
                { content: 'Explorar novas rotas', actions: [{ profile: 'Idealizador', points: '1' }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Se você quiser se dar bem comigo...',
            options: [
                { content: 'Me dê liberdade', actions: [{ profile: 'Idealizador', points: '1' }] },
                { content: 'Me deixe saber sua expectativa', actions: [{ profile: 'Organizador', points: '1' }] },
                { content: 'Lidere, siga ou saia do caminho', actions: [{ profile: 'Ativador', points: '1' }] },
                { content: 'Seja amigável, carinhoso e compreensivo', actions: [{ profile: 'Comunicador', points: '1' }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Para conseguir obter bons resultados é preciso...',
            options: [
                { content: 'Ter incertezas', actions: [{ profile: 'Idealizador', points: '1' }] },
                { content: 'Controlar o essencial', actions: [{ profile: 'Organizador', points: '1' }] },
                { content: 'Diversão e cerebração', actions: [{ profile: 'Comunicador', points: '1' }] },
                { content: 'Planejar e obter recursos', actions: [{ profile: 'Ativador', points: '1' }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Eu me divirto quando...',
            options: [
                { content: 'Estou me exercitando', actions: [{ profile: 'Ativador', points: '1' }] },
                { content: 'Tenho novidades', actions: [{ profile: 'Idealizador', points: '1' }] },
                { content: 'Estou com outros', actions: [{ profile: 'Comunicador', points: '1' }] },
                { content: 'Determino as regras', actions: [{ profile: 'Organizador', points: '1' }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Para conseguir obter bons resultados é preciso...',
            options: [
                { content: 'Ter incertezas', actions: [{ profile: 'Idealizador', points: '1' }] },
                { content: 'Controlar o essencial', actions: [{ profile: 'Organizador', points: '1' }] },
                { content: 'Diversão e cerebração', actions: [{ profile: 'Comunicador', points: '1' }] },
                { content: 'Planejar e obter recursos', actions: [{ profile: 'Ativador', points: '1' }] },
            ],
            optionsRandom: false
        },
        {
            content: 'Para conseguir obter bons resultados é preciso...',
            options: [
                { content: 'Ter incertezas', actions: [{ profile: 'Idealizador', points: '1' }] },
                { content: 'Controlar o essencial', actions: [{ profile: 'Organizador', points: '1' }] },
                { content: 'Diversão e cerebração', actions: [{ profile: 'Comunicador', points: '1' }] },
                { content: 'Planejar e obter recursos', actions: [{ profile: 'Ativador', points: '1' }] },
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

    function teste() {
        console.log()
    }

    return (
        <div>
            <main>
                {process.env.NODE_ENV === 'development' && <button onClick={teste}>Populate</button>}
            </main>
        </div>
    );
}
