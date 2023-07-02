import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app'
import { getFirebaseConfig } from './utils/firebase'

const firebaseConfig = getFirebaseConfig()

const app = initializeApp(firebaseConfig)

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
    const quizzesCollectionRef = collection(db, process.env.COLL_QUIZZES_STANDARD)

    try {
        const querySnapshot = await getDocs(quizzesCollectionRef)

        if (!querySnapshot.empty) {
            const quizzes = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                quizzes.push({
                    id: data.id,
                    name: data.name,
                    type: 'standard',
                    totalQuestions: data.questions.length,
                    category: data.category,
                    mode: data.mode,
                    creator: { 
                        id: 'quiz-time-app',
                        uui: 'quiz-time-app',
                    },
                })
            })

            return quizzes
        } else {
            console.log("No quiz documents found");
            return []
        }
    } catch (error) {
        console.log("Error getting quizzes documents:", error)
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
            console.log("Standard Quiz document not found")
        }
    } catch (error) {
        console.log("Error updating quiz:", error)
    }
}

async function createQuiz(quiz) {
    const db = getFirestore();
    const quizRef = doc(db, process.env.COLL_QUIZZES_STANDARD, quiz.id)

    try {
        // Salve o documento atualizado de volta no Firestore
        await setDoc(quizRef, quiz)

        console.log("Create Standard Quiz successfully")

    }
    catch (error) {
        console.log("Error creating standard quiz:", error)
    }
}


export {
    getQuiz,
    createQuiz,
    updateQuiz,
    getAllQuizzesInfo
}