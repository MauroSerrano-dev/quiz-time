export function getUserQuiz(userId, quizId) {
    const options = {
        method: 'GET',
        headers: {
            'userid': userId,
            'quizid': quizId,
        },
    }

    return fetch('/api/userQuiz', options)
}

export function getStandardQuiz(quizId) {
    const options = {
        method: 'GET',
        headers: { "quizid": quizId },
    }

    return fetch('/api/quizzesStandard', options)
}

export async function getImage(userId, fileId) {
    const options = {
        method: 'GET',
        headers: {
            'userid': userId,
            'filename': fileId,
        },
    }
    
    const response = await fetch('/api/googleCloud', options)
    const data = await response.json()
    
    // Aqui você pode acessar o objeto completo
    const { fileContents } = data;
    const jsonBuffer = Buffer.from(fileContents, 'hex')
    const img = JSON.parse(jsonBuffer.toString('utf-8'))
    return img
}

export function getAllQuizzesStandardInfo() {
    const options = {
        method: 'GET',
        headers: { type: 'info' },
    }
    return fetch("/api/quizzesStandard", options)
}