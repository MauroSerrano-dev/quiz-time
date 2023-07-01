import { getFirestore, updateDoc, doc, getDoc, getDocs, serverTimestamp, arrayUnion, where, query, collection } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getFirebaseConfig } from './utils/firebase'

// Inicialize o aplicativo Firebase
const firebaseConfig = getFirebaseConfig()

const app = initializeApp(firebaseConfig)

async function getUserById(id) {
    const db = getFirestore();
    const userRef = doc(db, process.env.COLL_USERS, id)

    try {
        const userDoc = await getDoc(userRef)

        // Verifique se o documento existe
        if (userDoc.exists()) {
            const userData = userDoc.data()

            return userData
        } else {
            console.log("User document not found")
        }
    } catch (error) {
        console.log("Error getting user:", error)
    }
}

async function getQuiz(id, quizId) {
    const db = getFirestore();
    const userRef = doc(db, process.env.COLL_USERS, id);

    try {
        const userDoc = await getDoc(userRef)

        // Verifique se o documento existe
        if (userDoc.exists()) {
            const userData = userDoc.data()
            const quizzes = userData.quizzes

            const quiz = quizzes.find((quiz) => quiz.id === quizId)

            if (quiz) {
                return quiz
            } else {
                return null
            }
        } else {
            console.log("User document not found")
            return null;
        }
    } catch (error) {
        console.log("Error getting quiz:", error)
        return null
    }
}

async function setCustomerIdInDatabase(email, customerId) {
    const db = getFirestore()
    const usersCollectionRef = collection(db, process.env.COLL_USERS)

    try {
        const querySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', email)))

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            const userData = userDoc.data()

            // Adicione ou atualize o campo
            userData.stripeCustomerId = customerId
            userData.updatedAt = serverTimestamp()

            // Salve o documento atualizado de volta no Firestore
            await updateDoc(userDoc.ref, userData)

            console.log("createQuiz successfully")
        } else {
            console.log("User document not found")
        }
    } catch (error) {
        console.log("Error saving newQuiz:", error)
    }
}

async function setUserPlan(email, plan) {
    const db = getFirestore()
    const usersCollectionRef = collection(db, process.env.COLL_USERS)

    try {
        const querySnapshot = await getDocs(query(usersCollectionRef, where('email', '==', email)))

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            const userData = userDoc.data()

            // Adicione ou atualize o campo
            userData.plan = plan
            userData.updatedAt = serverTimestamp()

            // Salve o documento atualizado de volta no Firestore
            await updateDoc(userDoc.ref, userData)

            console.log("createQuiz successfully")
        } else {
            console.log("User document not found")
        }
    } catch (error) {
        console.log("Error saving newQuiz:", error)
    }
}

async function createQuiz(id, email) {
    const db = getFirestore();
    const userRef = doc(db, process.env.COLL_USERS, id)

    try {
        const userDoc = await getDoc(userRef)

        // Verifique se o documento existe
        if (userDoc.exists()) {
            const userData = userDoc.data()

            const newQuiz = userData.sketchs[0]

            const quizInfo = {
                name: newQuiz.name,
                id: newQuiz.id,
                category: newQuiz.category,
                mode: newQuiz.mode,
                creator: {
                    id: id,
                    email: email,
                }
            }

            // Adicione ou atualize o campo
            userData.quizzes = arrayUnion(newQuiz)
            userData.quizzesInfo = arrayUnion(quizInfo)
            userData.sketchs = []
            userData.updatedAt = serverTimestamp()

            // Salve o documento atualizado de volta no Firestore
            await updateDoc(userRef, userData)

            console.log("createQuiz successfully")
        } else {
            console.log("User document not found")
        }
    } catch (error) {
        console.log("Error saving newQuiz:", error)
    }
}

export {
    getUserById,
    setUserPlan,
    setCustomerIdInDatabase,
    createQuiz,
    getQuiz
}