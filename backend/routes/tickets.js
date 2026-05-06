const express = require('express')
const { protect, merchantOnly } = require('../middleware/authMiddleware')
const { createTicket, getAllTickets, updateTicketStatus } = require('../controllers/ticketController')

const router = express.Router()

router.post('/', createTicket)
router.get('/', protect, merchantOnly, getAllTickets)
router.put('/:id', protect, merchantOnly, updateTicketStatus)

module.exports = router