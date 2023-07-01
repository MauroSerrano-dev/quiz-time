async function getTicket(id) {
  const db = getFirestore();
  const userRef = doc(db, process.env.COLL_TICKETS, id)

  try {
    const ticketDoc = await getDoc(userRef)

    // Verifique se o documento existe
    if (ticketDoc.exists()) {
      const ticketData = ticketDoc.data()

      return ticketData
    } else {
      console.log("Ticket document not found")
    }
  } catch (error) {
    console.log("Error getting ticket:", error)
  }
}

async function addTicket(ticket) {

}

async function updateTicket(ticket) {
}

export {
  getTicket,
  updateTicket,
  addTicket
}