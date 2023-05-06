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
                { content: 'Focado, determinado e persistente', actions: [{ profile: 'Ativador', points: '1' }] }
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
