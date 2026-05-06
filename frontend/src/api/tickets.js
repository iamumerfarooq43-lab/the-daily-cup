import api from './axiosConfig'

// Customer: submit a ticket (no auth needed)
export const createTicket = async (ticketData) => {
    const { data } = await api.post('/tickets', ticketData)
    return data
}

// Merchant: get all tickets
export const getAllTickets = async () => {
    const { data } = await api.get('/tickets')
    return data
}

// Merchant: update ticket status
export const updateTicketStatus = async (id, status) => {
    const { data } = await api.put(`/tickets/${id}`, { status })
    return data
}