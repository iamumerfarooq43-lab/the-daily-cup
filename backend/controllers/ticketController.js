const Ticket = require('../models/tickets')

const createTicket = async (req, res) => {
    try {
        const { name, email, category, message } = req.body
        const ticket = await Ticket.create({ name, email, category, message })
        res.status(201).json(ticket)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 })
        res.json(tickets)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!ticket) return res.status(404).json({ message: 'Ticket not found.' })
        res.json(ticket)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createTicket, getAllTickets, updateTicketStatus }