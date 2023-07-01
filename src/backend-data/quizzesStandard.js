async function getQuiz(id) {
    const db = getFirestore();
    const userRef = doc(db, process.env.COLL_QUIZZES_STANDARD, id)

    try {
        const quizDoc = await getDoc(userRef)

        // Verifique se o documento existe
        if (quizDoc.exists()) {
            const quizData = quizDoc.data()

            return quizData
        } else {
            console.log("Quiz document not found")
        }
    } catch (error) {
        console.log("Error getting quiz:", error)
    }
}

async function getAllQuizzesInfo() {
    const db = getFirestore()
    const usersCollectionRef = collection(db, process.env.COLL_QUIZZES_STANDARD)

    try {
        const querySnapshot = await getDocs(usersCollectionRef)

        if (!querySnapshot.empty) {
            const users = []
            querySnapshot.forEach((doc) => {
                users.push(doc.data())
            });

            return users
        } else {
            console.log("No user documents found");
            return []
        }
    } catch (error) {
        console.log("Error getting user documents:", error)
        return []
    }
}

async function updateQuiz(quiz) {
    const db = getFirestore();
    const userRef = doc(db, process.env.COLL_QUIZZES_STANDARD, quiz.id)

    try {
        const userDoc = await getDoc(userRef)

        // Verifique se o documento existe
        if (userDoc.exists()) {
            
            // Salve o documento atualizado de volta no Firestore
            await updateDoc(userRef, quiz)

            console.log("updateQuiz successfully")
        } else {
            console.log("User document not found")
        }
    } catch (error) {
        console.log("Error updating quiz:", error)
    }
}


export {
    getQuiz,
    updateQuiz,
    getAllQuizzesInfo
}