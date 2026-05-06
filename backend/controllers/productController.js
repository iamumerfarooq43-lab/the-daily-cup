const Product = require('../models/Product')

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.status(404).json({ message: 'Product not found.' })
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { price, inStock } = req.body
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { price, inStock },
            { new: true }
        )
        if (!product) return res.status(404).json({ message: 'Product not found.' })
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getAllProducts, getProductById, updateProduct }