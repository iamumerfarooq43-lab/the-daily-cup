const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
})

const orderSchema = new mongoose.Schema(
    {
        // auto-generated order number e.g. #ORD-1042
        orderNumber: {
            type: String,
            unique: true,
        },

        // who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // what was ordered
        items: [orderItemSchema],

        // financials
        totalAmount: {
            type: Number,
            required: true,
        },

        // order status flow
        status: {
            type: String,
            enum: ['New', 'Preparing', 'Trip Started', 'Delivered', 'Cancelled'],
            default: 'New',
        },

        // delivery info
        deliveryAddress: {
            type: String,
            required: true,
        },

        specialInstructions: {
            type: String,
            default: '',
        },

        paymentMethod: {
            type: String,
            enum: ['cash', 'credit-card', 'debit-card', 'digital-wallet'],
            default: 'cash',
        },

        estimatedDelivery: {
            type: Number, // minutes
            default: 30,
        },
        dropoffLocation: {
            lat: { type: Number },
            lng: { type: Number },
        },
    },
    {
        timestamps: true,
    }
)

// auto-generate order number before saving
// Replace your pre-save hook with this
orderSchema.pre('save', async function () {
    if (!this.orderNumber) {
        const last = await mongoose.model('Order')
            .findOne({}, { orderNumber: 1 })
            .sort({ createdAt: -1 })
            .lean()

        const lastNum = last?.orderNumber
            ? parseInt(last.orderNumber.replace('#ORD-', ''))
            : 1000

        this.orderNumber = `#ORD-${lastNum + 1}`
    }
})

module.exports = mongoose.model('Order', orderSchema)