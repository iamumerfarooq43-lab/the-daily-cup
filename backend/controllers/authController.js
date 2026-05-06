const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({ fullName, email, password: hashedPassword })
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' })
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.status(200).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { registerUser, loginUser }