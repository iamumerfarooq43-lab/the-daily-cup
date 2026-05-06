const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema(
    {
        ticketNumber: { type: String, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        category: {
            type: String,
            enum: ['order_issue', 'support', 'feedback'],
            required: true,
        },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['Open', 'Hold', 'Solved'],
            default: 'Open',
        },
    },
    { timestamps: true }
)

ticketSchema.pre('save', async function () {
    if (!this.ticketNumber) {
        const count = await mongoose.model('Ticket').countDocuments()
        this.ticketNumber = `TKT-${String(1000 + count + 1)}`
    }
})

module.exports = mongoose.model('Ticket', ticketSchema)