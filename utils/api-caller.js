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

export function getStandardQuiz() {
    const options = {
        method: 'GET',
        headers: { "quizname": room.quizInfo.name },
    }

    return fetch('/api/quizzesStandard', options)
}

export async function getImage(userId, fileId) {
    console.log('userId', userId)
    console.log('fileId', fileId)
    const options = {
        method: 'GET',
        headers: {
            'userid': userId,
            'filename': fileId,
        },
    }
    
    const response = await fetch('/api/googleCloud', options)
    const data = await response.json()
    console.log('response', response)
    console.log('data', data)
    
    // Aqui você pode acessar o objeto completo
    const { fileContents } = data;
    const jsonBuffer = Buffer.from(fileContents, 'hex')
    const img = JSON.parse(jsonBuffer.toString('utf-8'))
    return img
}