const express = require('express')
const asyncHandler = require('express-async-handler')
const { protect, merchantOnly } = require('../middleware/authMiddleware')
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController')

const router = express.Router()

router.post('/', protect, asyncHandler(createOrder))
router.get('/mine', protect, asyncHandler(getMyOrders))
router.get('/', protect, merchantOnly, asyncHandler(getAllOrders))
router.put('/:id', protect, merchantOnly, asyncHandler(updateOrderStatus))
router.delete('/:id', protect, asyncHandler(deleteOrder))

module.exports = router