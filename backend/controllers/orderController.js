const Order = require('../models/Order')

const createOrder = async (req, res) => {
    const { items, deliveryAddress, specialInstructions, paymentMethod, dropoffLocation } = req.body
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = await Order.create({
        user: req.user._id,
        items,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        deliveryAddress,
        specialInstructions: specialInstructions || '',
        paymentMethod: paymentMethod || 'cash',
        dropoffLocation: dropoffLocation || {},
        estimatedDelivery: 30,
    })
    res.status(201).json(order)
}

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name image')
    res.json(orders)
}

const getAllOrders = async (req, res) => {
    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('user', 'fullName email')
        .populate('items.product', 'name image')
    res.json(orders)
}

const updateOrderStatus = async (req, res) => {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) {
        res.status(404)
        throw new Error('Order not found.')
    }
    res.json(order)
}

const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        res.status(404)
        throw new Error('Order not found.')
    }
    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403)
        throw new Error('Not authorized.')
    }
    if (order.status !== 'New') {
        res.status(400)
        throw new Error('Cannot cancel order that is already being prepared.')
    }
    await order.deleteOne()
    res.json({ message: 'Order cancelled successfully.' })
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder }