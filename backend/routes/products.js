const express = require('express')
const { protect, merchantOnly } = require('../middleware/authMiddleware')
const { getAllProducts, getProductById, updateProduct } = require('../controllers/productController')

const router = express.Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', protect, merchantOnly, updateProduct)

module.exports = router